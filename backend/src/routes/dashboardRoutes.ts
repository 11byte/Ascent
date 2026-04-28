import { Router } from "express";
import type { BlogInteraction } from "@prisma/client";
import { prisma } from "../utils/prisma.js";

import { getUserKafkaData } from "../services/kafkaConsumerService.js";

const router = Router();

router.get("/students", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: true,
        achievements: true,
        trackerSessions: true, // 👈 IMPORTANT
      },
    });

    const students = users.map((u) => {
      const kafkaData = getUserKafkaData(u.userId) || {
        quiz: [],
        github: [],
        blog: [],
      };

      /* -------------------------
         🔥 TRANSFORM LOGIC
      ------------------------- */

      const gitContribs = kafkaData.github.length * 5;

      const leetSolved = kafkaData.quiz.length * 2;

      const behaviorScore = Math.min(
        100,
        kafkaData.quiz.length * 5 +
          kafkaData.github.length * 3 +
          kafkaData.blog.length * 2,
      );

      const domains = u.trackerSessions?.[0]?.assignedDomain
        ? [u.trackerSessions[0].assignedDomain]
        : [];

      const timelineScore = [20, 40, 60, behaviorScore];

      return {
        id: u.id.toString(),
        name: u.name,
        roll: `ROLL-${u.id}`,
        email: u.email,
        phase: 4,

        domains,

        placementInterest: "Placement",

        achievements: u.achievements.map((a) => a.title),

        gitContribs,
        leetSolved,
        behaviorScore,

        timelineScore,

        swot: {
          strengths: domains,
          weaknesses: [],
          opportunities: ["Hackathons"],
          threats: [],
        },
      };
    });

    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

export default router;
