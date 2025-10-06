const kafka = require("./kafka");
const producer = kafka.producer();

async function sendEvent(topic, data) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(data) }],
  });
  await producer.disconnect();
}

module.exports = { sendEvent };
