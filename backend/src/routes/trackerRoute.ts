import { Router, Request, Response } from "express";
import { sendEventToKafka } from "../utils/producer.js";

const router = Router();

/* =====================================================
   Quiz / Questionnaire Tracker → Kafka
===================================================== */
router.post("/quiz/save", async (req: Request, res: Response) => {
  try {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({ error: "Missing userId or data" });
    }

    const payload = {
      userId,
      feature: "quizTracker",
      data,
      timestamp: new Date().toISOString(),
    };

    // ✅ Send to Kafka
    await sendEventToKafka(
      "quiz-tracker-events",
      userId,
      "quizTracker",
      payload,
    );
    console.log(`📤 Sent questionnaire data for user ${userId} to Kafka`);

    res.json({ ok: true, message: "Data sent to Kafka successfully" });
  } catch (err) {
    console.error("❌ Failed to send quiz data to Kafka:", err);
    res.status(500).json({ error: "Failed to send data to Kafka" });
  }
});

export default router;
