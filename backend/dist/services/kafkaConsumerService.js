import { Kafka } from "kafkajs";
import { prisma } from "../utils/prisma.js";
const kafka = new Kafka({
    clientId: "ascent-domain-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "ascent-shared-consumer-v3" });
// Central in-memory cache (user → topic → messages)
export const userCache = {};
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
                if (!userId)
                    return;
                if (!userCache[userId]) {
                    userCache[userId] = { quiz: [], github: [], blog: [] };
                }
                switch (topic) {
                    case "quiz-tracker-events":
                        userCache[userId].quiz.push(msg);
                        // 2. NEW: Save the ML payload permanently to PostgreSQL
                        if (feature === "trackerV2" && data) {
                            await prisma.$transaction(async (tx) => {
                                await tx.trackerSession.create({
                                    data: {
                                        userId: userId,
                                        assignedDomain: data.assignedDomain,
                                        metrics: data.metrics,
                                    },
                                });
                                const creditUpdate = await tx.user.updateMany({
                                    where: { userId },
                                    data: { roadmap_credits: { increment: 50 } },
                                });
                                if (creditUpdate.count > 0) {
                                    console.log(`💾 Saved TrackerV2 ML Session and added 50 roadmap credits for user: ${userId}`);
                                }
                                else {
                                    console.log(`💾 Saved TrackerV2 ML Session for user: ${userId} but no matching user row was found for credit update`);
                                }
                            });
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
            }
            catch (err) {
                console.error("Error processing Kafka message:", err);
            }
        },
    });
    console.log("Shared Kafka Consumer started — listening to all tracker topics");
}
export function getUserKafkaData(userId) {
    console.log("Available users in cache:", Object.keys(userCache));
    return userCache[userId];
}
