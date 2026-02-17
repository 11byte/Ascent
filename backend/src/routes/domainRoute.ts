import express from "express";
import { spawn } from "child_process";
import { getUserKafkaData } from "../services/kafkaConsumerService.js";

const router = express.Router();

/**
 * POST /api/domain/predict
 * Automatically aggregates user’s Kafka data, extracts numerical features, and calls the ML model.
 */
router.post("/domain/predict", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // ✅ 1️⃣ Fetch cached Kafka data for this user
    const userData = getUserKafkaData(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ error: "No Kafka data found for this user" });
    }

    // ✅ 2️⃣ Extract flat numerical features
    const featurePayload = extractFeatures(userData);

    // ✅ 3️⃣ Call Python script with features
    const python = spawn("python", ["domain_predict.py"]);
    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("🐍 Python error:", data.toString());
    });

    python.on("close", () => {
      try {
        const result = JSON.parse(output);
        console.log("🎯 Domain Prediction Result:", result);
        res.json(result);
      } catch (err) {
        console.error("❌ Failed to parse Python output:", err);
        res.status(500).json({ error: "Invalid response from model" });
      }
    });

    python.stdin.write(JSON.stringify(featurePayload));
    python.stdin.end();
  } catch (err) {
    console.error("🚨 Domain prediction route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add this route in domainRoute.ts
router.get("/kafka/data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = getUserKafkaData(userId);

    if (!data) {
      return res
        .status(404)
        .json({ error: "No Kafka data found for this user" });
    }

    console.log(`✅ Fetched cached Kafka data for ${userId}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Kafka data fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Kafka data" });
  }
});

/**
 * 🧮 Feature extraction logic
 * Converts raw Kafka data → numerical inputs for the model
 */
function extractFeatures(userData: any) {
  const quizData = userData.quiz || [];
  const githubData = userData.github || [];
  const blogData = userData.blog || [];

  // Simple heuristic-based feature extraction (you can make this smarter later)
  const features = {
    quiz_interest_AI:
      quizData.filter((q: any) => q.data?.domain === "AI").length /
      (quizData.length || 1),
    quiz_interest_Web:
      quizData.filter((q: any) => q.data?.domain === "Web").length /
      (quizData.length || 1),
    quiz_interest_Design:
      quizData.filter((q: any) => q.data?.domain === "Design").length /
      (quizData.length || 1),
    github_commits: githubData[0]?.data?.github?.repos?.length || 0,
    github_repos: githubData[0]?.data?.github?.profile?.public_repos || 0,
    blog_reads: blogData.filter((b: any) => b.data?.interested).length,
    blog_likes: blogData.filter((b: any) => b.data?.interested === true).length,
  };

  console.log("📊 Extracted Features:", features);
  return features;
}

export default router;
