import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blogRoutes";
import timelineRoutes from "./routes/timelineRoutes";
import githubTrackerRoutes from "./routes/githubTracker";
import trackerRoute from "./routes/trackerRoute";
import domainRoute from "./routes/domainRoute";
import roadmapRouter from "./routes/roadmap.route";

import { connectProducer, sendEventToKafka } from "./utils/producer";
import { startKafkaConsumer, userCache } from "./services/kafkaConsumerService";
import { warmupKafkaCache } from "./utils/warmupKafka";

const app = express();

/* =====================================================
   🧩 Middleware Setup
===================================================== */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

/* =====================================================
   🧠 Routes
===================================================== */
app.use("/api", blogRoutes);
app.use("/auth", authRoutes);
app.use("/api", timelineRoutes);
app.use("/tracker", githubTrackerRoutes);
app.use("/tracker", trackerRoute);
app.use("/api", domainRoute);
app.use("/api", domainRoute);
/* =====================================================
   🩺 Health Check Route
===================================================== */
app.get("/", (_req, res) => {
  res.send("✅ Ascent Backend is Running!");
});

app.get("/kafka/test", async (_req, res) => {
  try {
    console.log("🧠 Testing Kafka send...");
    await sendEventToKafka(
      "student.blog.interest",
      "test-user",
      "debugFeature",
      { message: "Kafka test event" },
    );
    res.json({ ok: true, message: "Test event sent to Kafka" });
  } catch (err) {
    console.error("❌ Kafka test failed:", err);
    res.status(500).json({ error: "Kafka test failed" });
  }
});

/* =====================================================
   🚀 Start Server + Kafka Warmup
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);

  // ✅ Step 1: Warmup cache before ANY real consumer starts
  await warmupKafkaCache();

  // ✅ Step 2: Start real-time shared consumer
  await startKafkaConsumer();

  // ✅ Step 3: Connect Kafka producer
  try {
    await connectProducer();
    await sendEventToKafka("system-logs", "server", "startup", {
      message: "Ascent backend started successfully",
    });

    console.log("🚀 Kafka producer connected and ready!");
  } catch (err) {
    console.error("⚠️ Kafka initialization failed:", err);
  }
});
