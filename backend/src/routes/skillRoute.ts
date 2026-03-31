import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma.js";
import { sendEventToKafka } from "../utils/producer.js";
import jwt from "jsonwebtoken";

const router = Router();

/* =====================================================
   AUTH MIDDLEWARE (JWT BASED)
===================================================== */

function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* =====================================================
   ADD SKILL
===================================================== */

router.post("/add", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { phase, category, skillName, level, proofUrl } = req.body;

    if (!phase || !category || !skillName) {
      return res.status(400).json({
        error: "phase, category and skillName are required",
      });
    }

    const skill = await prisma.skill.create({
      data: {
        userId,
        phase,
        category,
        skillName,
        level: level ?? null,
        proofUrl: proofUrl ?? null,
      },
    });

    /* ===== Send event to Kafka ===== */

    const payload = {
      userId,
      eventType: "skillAdded",
      skill: {
        id: skill.id,
        phase,
        category,
        skillName,
        level,
        proofUrl,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await sendEventToKafka(
        "student-skill-events",
        String(userId),
        "skillLogger",
        payload,
      );

      console.log("Skill event sent to Kafka pipeline");
    } catch (kafkaErr) {
      console.error("Kafka send failed:", kafkaErr);
    }

    res.status(201).json({
      ok: true,
      message: "Skill logged successfully",
      skill,
    });
  } catch (err) {
    console.error("Add skill error:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =====================================================
   GET ALL SKILLS FOR CURRENT USER
===================================================== */

router.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      count: skills.length,
      skills,
    });
  } catch (err) {
    console.error("Fetch skills error:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =====================================================
   GET TIMELINE DATA
===================================================== */

router.get("/timeline", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    const grouped = skills.reduce((acc: any, skill) => {
      if (!acc[skill.phase]) {
        acc[skill.phase] = [];
      }

      acc[skill.phase].push({
        id: skill.id,
        category: skill.category,
        skillName: skill.skillName,
        level: skill.level,
        proofUrl: skill.proofUrl,
      });

      return acc;
    }, {});

    res.json({
      ok: true,
      timeline: grouped,
    });
  } catch (err) {
    console.error("Timeline generation error:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =====================================================
   DELETE SKILL (SECURE)
===================================================== */

router.delete("/:skillId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { skillId } = req.params;
    const userId = (req as any).user.id;

    const skill = await prisma.skill.findUnique({
      where: { id: Number(skillId) },
    });

    if (!skill) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    if (skill.userId !== userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    await prisma.skill.delete({
      where: { id: Number(skillId) },
    });

    res.json({
      ok: true,
      message: "Skill deleted successfully",
    });
  } catch (err) {
    console.error("Delete skill error:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =====================================================
   GET SKILLS BY PHASE
===================================================== */

router.get(
  "/phase/:phase",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { phase } = req.params;

      const skills = await prisma.skill.findMany({
        where: {
          userId,
          phase,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json({
        ok: true,
        phase,
        count: skills.length,
        skills,
      });
    } catch (err) {
      console.error("Fetch phase skills error:", err);

      res.status(500).json({
        error: "Server error",
      });
    }
  },
);

export default router;
