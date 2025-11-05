import { Router, Request, Response } from "express";
import { sendEventToKafka } from "../utils/producer";

const router = Router();

router.post("/timeline/sync", async (req: Request, res: Response) => {
  try {
    const { userId, timelineData } = req.body;

    if (!userId || !timelineData)
      return res.status(400).json({ error: "Invalid payload" });

    const payload = {
      timeline: timelineData,
    };

    await sendEventToKafka("timeline-events", userId, "timeline", payload);

    res.json({ ok: true, message: "Timeline data sent to Kafka" });
  } catch (err) {
    console.error("❌ Timeline sync error:", err);
    res.status(500).json({ error: "Failed to sync timeline" });
  }
});

export default router;
