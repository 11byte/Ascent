import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blogRoutes";
import { sendEvent } from "./utils/producer"; // ✅ use Kafka wrapper directly if needed

const app = express();

// ---------------- Middleware ----------------
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// ---------------- Routes ----------------
app.use("/api", blogRoutes); // ✅ cleaner route prefix for all API routes
app.use("/auth", authRoutes);

// ---------------- Health Check ----------------
app.get("/", (_, res) => {
  res.send("✅ Ascent Backend is Running!");
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);

  // Lazy connect Kafka producer (optional warmup)
  try {
    await sendEvent("startup-log", { message: "Ascent backend started" });
    console.log("🚀 Kafka producer ready");
  } catch (err) {
    console.error("⚠️ Kafka not ready:", err);
  }
});
