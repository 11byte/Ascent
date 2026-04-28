import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "ascent-backend",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
