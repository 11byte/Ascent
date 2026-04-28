import { Router, Request, Response } from "express";
import { sendEventToKafka } from "../utils/producer.js";
import { trackerService } from "../services/tracker.service.js";
import { prisma } from "../utils/prisma.js";
const router = Router();

/* =====================================================
   Tracker V2 (ML Payload) → Kafka
===================================================== */
router.post("/quiz/save", async (req: Request, res: Response) => {
  try {
    // The TrackerV2 frontend sends mlPayload containing these fields
    const { userId, assigned_target_domain, games } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Construct the data object to send
    const dataPayload = {
      assignedDomain: assigned_target_domain,
      metrics: games,
      timestamp: new Date().toISOString(),
    };

    // FIX: Pass all 4 arguments exactly as your producer.ts expects
    await sendEventToKafka(
      "quiz-tracker-events", // 1. topic (Matches your consumer)
      userId, // 2. userId
      "trackerV2", // 3. feature name
      dataPayload, // 4. data object
    );

    console.log(`\n\n\n================================================================================================================
                       =============================Sent TrackerV2 ML payload for user ${userId} to Kafka==============================\n\n\n`);

    return res.json({ ok: true, message: "Data sent to Kafka successfully" });
  } catch (err) {
    console.error("Failed to send tracker v2 data to Kafka:", err);
    return res.status(500).json({ error: "Failed to send data to Kafka" });
  }
});

router.get("/quiz/stats/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const [playCount, latestSession] = await Promise.all([
      prisma.trackerSession.count({ where: { userId } }),
      prisma.trackerSession.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          assignedDomain: true,
        },
      }),
    ]);

    return res.status(200).json({
      ok: true,
      userId,
      playCount,
      latestSession,
    });
  } catch (err) {
    console.error("Failed to fetch tracker stats:", err);
    return res.status(500).json({ error: "Failed to fetch tracker stats" });
  }
});

router.get("/predict/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    // 1. Get the key (same logic you use in roadmap)
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Fetch the user's sessions from PostgreSQL
    const sessions = await prisma.trackerSession.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    if (sessions.length < 4) {
      return res.status(200).json({
        status: false,
        message: `Need more data. Completed ${sessions.length}/4 sessions.`,
      });
    }

    // 3. Format the data for the AI
    const aggregatedData = sessions.map((s, index) => ({
      session_number: index + 1,
      target_domain_tested: s.assignedDomain,
      metrics: s.metrics,
    }));

    // 4. Call your new service!
    const prediction = await trackerService.predictUserDomain(
      aggregatedData,
      apiKey,
    );

    return res.status(200).json({
      status: true,
      prediction,
    });
  } catch (error) {
    console.error("Express Tracker Prediction Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Prediction failed." });
  }
});

export default router;
