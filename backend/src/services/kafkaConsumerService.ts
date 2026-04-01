import { Kafka } from "kafkajs";
import { prisma } from "../utils/prisma.js";

const kafka = new Kafka({
  clientId: "ascent-domain-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "ascent-shared-consumer-v3" });

// Central in-memory cache (user → topic → messages)
export const userCache: Record<string, any> = {};

export async function startKafkaConsumer() {
  await consumer.connect();

  const topics = [
    "quiz-tracker-events",
    "github-tracker-events",
    "blog-events",
  ];

  for (const t of topics) {
    await consumer.subscribe({ topic: t, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const msg = JSON.parse(message.value?.toString() || "{}");
        const { userId, feature, data } = msg;

        if (!userId) return;

        if (!userCache[userId]) {
          userCache[userId] = { quiz: [], github: [], blog: [] };
        }

        switch (topic) {
          case "quiz-tracker-events":
            userCache[userId].quiz.push(msg);
            // 2. NEW: Save the ML payload permanently to PostgreSQL
            if (feature === "trackerV2" && data) {
              await prisma.trackerSession.create({
                data: {
                  userId: userId,
                  assignedDomain: data.assignedDomain,
                  metrics: data.metrics,
                },
              });
              console.log(
                `💾 Saved TrackerV2 ML Session to Database for user: ${userId}`,
              );
            }
            break;
          case "github-tracker-events":
            userCache[userId].github.push(msg);
            break;
          case "blog-events":
            userCache[userId].blog.push(msg);
            break;
        }

        console.log(`Cached message for user ${userId} under ${topic}`);
      } catch (err) {
        console.error("Error processing Kafka message:", err);
      }
    },
  });

  console.log(
    "Shared Kafka Consumer started — listening to all tracker topics",
  );
}

export function getUserKafkaData(userId: string) {
  console.log("Available users in cache:", Object.keys(userCache));
  return userCache[userId];
}
