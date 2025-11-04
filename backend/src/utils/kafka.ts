import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "ascent-backend",
  brokers: ["localhost:9092"], // Adjust if using remote Kafka cluster
});
