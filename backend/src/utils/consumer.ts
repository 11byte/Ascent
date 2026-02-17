import { kafka } from "./kafka.js";

const consumer = kafka.consumer({ groupId: "ascent-blog-interests" });

export async function startConsumer() {
  try {
    await consumer.connect();

    // ✅ Match the same topic as your producer
    await consumer.subscribe({
      topic: "student.blog.interest",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawValue = message.value?.toString();
        if (!rawValue) return;

        console.log(`📥 Received message on ${topic}: ${rawValue}`);

        try {
          const data = JSON.parse(rawValue);

          // ✅ Example structure: { title: "...", interested: true, timestamp: "..." }
          if (data.interested) {
            console.log(
              `💡 User marked blog as INTERESTED: "${data.title}" at ${data.timestamp}`,
            );
          } else {
            console.log(
              `❌ User marked blog as NOT INTERESTED: "${data.title}"`,
            );
          }

          // (Optional) If you want to store this interaction:
          // await prisma.blogInteraction.create({
          //   data: {
          //     title: data.title,
          //     interested: data.interested,
          //     createdAt: new Date(data.timestamp),
          //   },
          // });
        } catch (err) {
          console.error("❌ Error processing Kafka message:", err);
        }
      },
    });

    console.log("✅ Kafka Consumer started for topic: student.blog.interest");
  } catch (error) {
    console.error("❌ Error starting Kafka consumer:", error);
  }
}
