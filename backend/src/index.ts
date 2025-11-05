import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blogRoutes";
import { connectProducer, sendEventToKafka } from "./utils/producer"; // ✅ Updated import
import timelineRoutes from "./routes/timelineRoutes";
import githubTrackerRoutes from "./routes/githubTracker";
import trackerRoute from "./routes/trackerRoute";
import domainRoute from "./routes/domainRoute";
import { startKafkaConsumer } from "./services/kafkaConsumerService";
const app = express();

/* =====================================================
   🧩 Middleware Setup
===================================================== */
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
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
      { message: "Kafka test event" }
    );
    res.json({ ok: true, message: "Test event sent to Kafka" });
  } catch (err) {
    console.error("❌ Kafka test failed:", err);
    res.status(500).json({ error: "Kafka test failed" });
  }
});

/* =====================================================
   🚀 Start Server
===================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  await startKafkaConsumer();
  // --- Initialize Kafka Producer on startup ---
  try {
    await connectProducer();

    // Optionally send a startup event to Kafka for monitoring
    await sendEventToKafka("system-logs", "server", "startup", {
      message: "Ascent backend started successfully",
    });

    console.log("🚀 Kafka producer connected and ready!");
  } catch (err) {
    console.error("⚠️ Kafka initialization failed:", err);
  }
});
