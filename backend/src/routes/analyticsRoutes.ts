import { Router } from "express";
import { prisma } from "../utils/prisma.js";

const router = Router();

/*
  GET STUDENT ANALYTICS FOR DASHBOARD
*/
router.get("/students", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: true,
        achievements: true,
      },
    });

    const students = users.map((u) => ({
      id: u.id.toString(),
      name: u.name,
      roll: `ROLL-${u.id}`,
      email: u.email,
      phase: 4, // you can calculate this later
      domains: [],
      placementInterest: "Placement",
      achievements: u.achievements.map((a) => a.title),
      gitContribs: 0,
      leetSolved: 0,
      behaviorScore: 70,
      timelineScore: [0, 0, 0, 70],
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
    }));

    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;
