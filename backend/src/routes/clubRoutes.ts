import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma.js";

const router = Router();

/* =====================================================
   TEMP AUTH (same as your auth route)
===================================================== */
function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Skipping JWT verification for testing");
    (req as any).user = { id: 1 }; // mock user
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
}

/* =====================================================
   GET CLUB (FULL DATA)
===================================================== */

router.get("/challenges/all", async (req: Request, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      include: {
        club: true, // 🔥 gives club name
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json({ ok: true, challenges });
  } catch (err) {
    console.error("Get all challenges error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const clubId = Number(req.params.id);

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        events: true,
        challenges: true,
        members: true,
        macrothons: true,
      },
    });

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.json({ ok: true, club });
  } catch (err) {
    console.error("Get club error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   UPDATE CLUB INFO (ADMIN)
===================================================== */
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const clubId = Number(req.params.id);
    const { name, tagline, description, president } = req.body;

    const updated = await prisma.club.update({
      where: { id: clubId },
      data: {
        name,
        tagline,
        description,
        president,
      },
    });

    res.json({ ok: true, club: updated });
  } catch (err) {
    console.error("Update club error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   ADD EVENT
===================================================== */
router.post("/event", verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, date, time, venue, speaker, status, clubId } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        date,
        time,
        venue,
        speaker,
        status: status || "UPCOMING",
        clubId,
      },
    });

    res.status(201).json({ ok: true, event });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   UPDATE EVENT
===================================================== */
router.put("/event/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: req.body,
    });

    res.json({ ok: true, event: updated });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   ADD CHALLENGE
===================================================== */
router.post("/challenge", verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, description, points, clubId, clubName } = req.body;

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        points,
        clubId,
        clubName,
      },
    });

    res.status(201).json({ ok: true, challenge });
  } catch (err) {
    console.error("Create challenge error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   UPDATE CHALLENGE
===================================================== */

router.put(
  "/challenge/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const challengeId = Number(req.params.id);

      const updated = await prisma.challenge.update({
        where: { id: challengeId },
        data: req.body,
      });

      res.json({ ok: true, challenge: updated });
    } catch (err) {
      console.error("Update challenge error:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

/* =====================================================
   ADD MEMBER
===================================================== */
router.post("/member", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, role, tier, clubId } = req.body;

    const member = await prisma.clubMember.create({
      data: {
        name,
        role,
        tier,
        clubId,
      },
    });

    res.status(201).json({ ok: true, member });
  } catch (err) {
    console.error("Create member error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   UPDATE MEMBER
===================================================== */
router.put("/member/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const memberId = Number(req.params.id);

    const updated = await prisma.clubMember.update({
      where: { id: memberId },
      data: req.body,
    });

    res.json({ ok: true, member: updated });
  } catch (err) {
    console.error("Update member error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   DELETE (OPTIONAL)
===================================================== */
router.delete(
  "/event/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      await prisma.event.delete({
        where: { id: Number(req.params.id) },
      });

      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Delete failed" });
    }
  },
);

router.get("/macrothons/all", async (req: Request, res: Response) => {
  try {
    const macrothons = await prisma.macrothon.findMany({
      include: { club: true },
      orderBy: { id: "desc" },
    });

    res.json({ ok: true, macrothons });
  } catch (err) {
    console.error("Get macrothons error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.post("/macrothon", verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, description, prize, startDate, deadline, domain, clubId } =
      req.body;

    const macrothon = await prisma.macrothon.create({
      data: {
        title,
        description,
        prize,
        startDate,
        deadline,
        domain,
        clubId,
      },
    });

    res.status(201).json({ ok: true, macrothon });
  } catch (err) {
    console.error("Create macrothon error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put(
  "/macrothon/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const macrothonId = Number(req.params.id);

      const updated = await prisma.macrothon.update({
        where: { id: macrothonId },
        data: req.body,
      });

      res.json({ ok: true, macrothon: updated });
    } catch (err) {
      console.error("Update macrothon error:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.delete(
  "/macrothon/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      await prisma.macrothon.delete({
        where: { id: Number(req.params.id) },
      });

      res.json({ ok: true });
    } catch (err) {
      console.error("Delete macrothon error:", err);
      res.status(500).json({ error: "Delete failed" });
    }
  },
);

export default router;
