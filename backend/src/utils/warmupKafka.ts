// src/utils/warmupKafka.ts
import { Kafka } from "kafkajs";
import { userCache } from "../services/kafkaConsumerService";

export async function warmupKafkaCache() {
  console.log("🔥 Warming up Kafka cache...");

  const kafka = new Kafka({
    clientId: "ascent-warmup",
    brokers: ["localhost:9092"],
  });

  const topics = [
    "quiz-tracker-events",
    "github-tracker-events",
    "blog-events",
  ];

  const warmupConsumer = kafka.consumer({
    groupId: `warmup-consumer-${Date.now()}`, // ✅ unique, isolated
  });

  try {
    await warmupConsumer.connect();

    for (const topic of topics) {
      await warmupConsumer.subscribe({ topic, fromBeginning: true });
    }

    console.log("⏳ Warmup consumer started — replaying all messages...");

    await warmupConsumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const msg = JSON.parse(message.value?.toString() || "{}");
          const { userId } = msg;
          if (!userId) return;

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
        } catch (err) {
          console.error("❌ Warmup message error:", err);
        }
      },
    });

    // ✅ Important: Wait a moment for late messages
    await new Promise((r) => setTimeout(r, 1000));
  } finally {
    console.log("✅ Warmup complete — disconnecting warmup consumer.");
    await warmupConsumer.stop();
    await warmupConsumer.disconnect();
  }

  console.log("✅ Kafka Warmup Done! Cache rebuilt.");
}
