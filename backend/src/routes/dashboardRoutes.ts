import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { getUserKafkaData } from "../services/kafkaConsumerService.js";

const router = Router();

router.get("/students", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: true,
        achievements: true,
        trackerSessions: true,
      },
    });

    const students = users.map((u) => {
      /* -------------------------
         🔥 KAFKA DATA (USE userId)
      ------------------------- */
      const kafkaData = getUserKafkaData(u.userId) || {
        quiz: [],
        github: [],
        blog: [],
      };

      /* -------------------------
         🔥 LATEST TRACKER SESSION
      ------------------------- */
      const latestSession = u.trackerSessions?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      /* -------------------------
         🔥 METRICS (IMPROVED)
      ------------------------- */
      const gitContribs = kafkaData.github.length * 5;
      const leetSolved = kafkaData.quiz.length * 2;

      const behaviorScore = Math.min(
        100,
        kafkaData.quiz.length * 5 +
          kafkaData.github.length * 3 +
          kafkaData.blog.length * 2,
      );

      /* -------------------------
         🔥 DOMAIN (FROM ML)
      ------------------------- */
      const domains = latestSession?.assignedDomain
        ? [latestSession.assignedDomain]
        : [];

      /* -------------------------
         🔥 SKILLS (FIXED)
      ------------------------- */
      const skillLog = u.skills.map((s) => ({
        name: s.skillName, // ✅ correct field
        level:
          s.level === "advanced"
            ? 90
            : s.level === "intermediate"
              ? 70
              : s.level === "beginner"
                ? 40
                : 50,
      }));

      /* -------------------------
         🔥 PHASE (FIXED)
      ------------------------- */
      const phase = Number(u.phase) as 1 | 2 | 3 | 4;

      /* -------------------------
         🔥 TIMELINE (SMART)
      ------------------------- */
      const timelineScore = [0, 0, 0, 0];
      for (let i = 0; i < phase; i++) {
        timelineScore[i] = Math.min(100, behaviorScore - i * 10);
      }

      return {
        id: u.userId, // ✅ IMPORTANT: use userId
        name: u.name,
        roll: `ROLL-${u.userId}`,
        email: u.email,

        phase,

        domains,
        placementInterest: "Placement",

        skillLog,

        achievements: u.achievements.map((a) => a.title),

        gitContribs,
        leetSolved,
        behaviorScore,

        timelineScore,

        swot: {
          strengths: domains,
          weaknesses: behaviorScore < 40 ? ["Low activity"] : [],
          opportunities: ["Hackathons", "Clubs"],
          threats: behaviorScore < 30 ? ["At Risk"] : [],
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
