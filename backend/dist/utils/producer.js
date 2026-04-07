import { Kafka } from "kafkajs";
const kafka = new Kafka({
    clientId: "ascent-backend",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
let producer = null;
// Initialize and connect producer once
export const connectProducer = async () => {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Kafka producer connected");
    }
    return producer;
};
// Helper: generic produce function for any topic
export const sendEventToKafka = async (topic, userId, feature, data) => {
    if (!producer) {
        await connectProducer();
    }
    const message = {
        key: userId, // ensures same partition per user
        value: JSON.stringify({
            userId,
            feature,
            data,
            timestamp: new Date().toISOString(),
        }),
    };
    await producer.send({
        topic,
        messages: [message],
    });
    console.log(`📤 Sent event → ${topic} | user: ${userId}`);
};
