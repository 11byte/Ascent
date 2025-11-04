import { kafka } from "./kafka";

const producer = kafka.producer();

// ✅ Connect producer only once
let isConnected = false;

export async function sendEvent(topic: string, payload: any) {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log("✅ Kafka producer connected");
    }

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });

    console.log(`📤 Event sent to Kafka topic "${topic}":`, payload);
  } catch (error) {
    console.error("❌ Error sending Kafka message:", error);
  }
}
