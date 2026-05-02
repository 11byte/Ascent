// src/utils/warmupKafka.ts
//
// FIX: Previously this used `groupId: \`warmup-consumer-${Date.now()}\`` which
// created a brand-new consumer group on every restart. Kafka had no record of
// what was already processed, so it always replayed every message from offset 0.
// Startup time grew linearly with total message history — unboundedly.
//
// The fix has two parts:
//   1. Use a stable group ID ("ascent-warmup-stable") so Kafka tracks committed
//      offsets across restarts. On the next startup only new messages are replayed.
//   2. Fetch the high-water-mark (latest offset) for every partition upfront.
//      Stop the consumer as soon as all partitions are caught up instead of
//      relying on an arbitrary 1-second sleep.

import { Kafka, Admin } from "kafkajs";
import { userCache } from "../services/kafkaConsumerService.js";

const STABLE_WARMUP_GROUP_ID = "ascent-warmup-stable";

const TOPICS = [
  "quiz-tracker-events",
  "github-tracker-events",
  "blog-events",
] as const;

/**
 * Fetches the latest (high-water-mark) offset for every partition of every
 * topic. Returns a map of "topic:partition" -> latestOffset (as bigint).
 * Partitions with no messages yet (offset "0") are excluded because there is
 * nothing to replay.
 */
async function fetchLatestOffsets(
  admin: Admin,
): Promise<Map<string, bigint>> {
  const latestOffsets = new Map<string, bigint>();

  for (const topic of TOPICS) {
    try {
      const offsets = await admin.fetchTopicOffsets(topic);
      for (const partition of offsets) {
        const latest = BigInt(partition.high);
        if (latest > 0n) {
          latestOffsets.set(`${topic}:${partition.partition}`, latest);
        }
      }
    } catch {
      // Topic may not exist yet on a fresh cluster — that is fine, skip it.
      console.warn(`[warmup] Topic "${topic}" not found, skipping.`);
    }
  }

  return latestOffsets;
}

export async function warmupKafkaCache(): Promise<void> {
  console.log("[warmup] Starting Kafka cache warmup...");

  const kafka = new Kafka({
    clientId: "ascent-warmup",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  });

  const admin = kafka.admin();
  await admin.connect();

  // Step 1: Find out where the tip of each partition is right now.
  const latestOffsets = await fetchLatestOffsets(admin);
  await admin.disconnect();

  if (latestOffsets.size === 0) {
    console.log("[warmup] No messages in any topic yet. Skipping warmup.");
    return;
  }

  console.log(
    `[warmup] Need to catch up on ${latestOffsets.size} partition(s).`,
  );

  // Track how many partitions we have fully consumed up to their latest offset.
  const caughtUp = new Set<string>();

  // Step 2: Create a consumer with a STABLE group ID.
  // On the very first run this behaves identically to fromBeginning: true.
  // On subsequent restarts Kafka resumes from the last committed offset,
  // so only messages produced since the previous startup are replayed.
  const warmupConsumer = kafka.consumer({
    groupId: STABLE_WARMUP_GROUP_ID,
  });

  try {
    await warmupConsumer.connect();

    for (const topic of TOPICS) {
      // fromBeginning only applies the very first time this group ID is seen
      // by the broker. After that, committed offsets take precedence.
      await warmupConsumer.subscribe({ topic, fromBeginning: true });
    }

    console.log("[warmup] Replaying messages since last committed offset...");

    await new Promise<void>((resolve, reject) => {
      warmupConsumer
        .run({
          // Commit offsets after each batch so progress is durable.
          autoCommit: true,
          autoCommitInterval: 1000,

          eachMessage: async ({ topic, partition, message }) => {
            try {
              const msg = JSON.parse(message.value?.toString() || "{}");
              const { userId } = msg;

              if (userId) {
                if (!userCache[userId]) {
                  userCache[userId] = { quiz: [], github: [], blog: [] };
                }

                switch (topic) {
                  case "quiz-tracker-events":
                    userCache[userId].quiz.push(msg);
                    break;
                  case "github-tracker-events":
                    userCache[userId].github.push(msg);
                    break;
                  case "blog-events":
                    userCache[userId].blog.push(msg);
                    break;
                }
              }

              // Check if this partition is now caught up.
              const key = `${topic}:${partition}`;
              const latestOffset = latestOffsets.get(key);

              if (latestOffset !== undefined) {
                // message.offset is the 0-based index of this message.
                // The partition is caught up when we have processed the message
                // at index (latestOffset - 1).
                const currentOffset = BigInt(message.offset as string);
                if (currentOffset >= latestOffset - 1n) {
                  caughtUp.add(key);
                }
              }

              // Resolve as soon as every tracked partition is caught up.
              if (caughtUp.size === latestOffsets.size) {
                resolve();
              }
            } catch (err) {
              console.error("[warmup] Error processing message:", err);
            }
          },
        })
        .catch(reject);
    });

    console.log(
      `[warmup] Caught up on all ${caughtUp.size} partition(s). Cache is ready.`,
    );
  } finally {
    await warmupConsumer.stop();
    await warmupConsumer.disconnect();
    console.log("[warmup] Warmup consumer disconnected.");
  }
}
