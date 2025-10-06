// kafka.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "ascent-backend",
  brokers: ["localhost:9092"], // Kafka broker
});

module.exports = kafka;
