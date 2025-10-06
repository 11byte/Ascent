const kafka = require("./kafka");
const consumer = kafka.consumer({ groupId: "ascent-analytics" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "student.blog", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Topic: ${topic} | Message: ${message.value.toString()}`);
      // Here you can send data to ML feature store or data lake
    },
  });
}

startConsumer();
