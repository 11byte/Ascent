import { Router } from "express";
import type { BlogInteraction } from "@prisma/client";
import { prisma } from "../utils/prisma.js";

const router = Router();

router.get("/students", async (_req, res) => {
  try {
    const interactions: BlogInteraction[] =
      await prisma.blogInteraction.findMany();

    const domainStats = interactions.reduce<Record<string, number>>(
      (acc, curr) => {
        if (!acc[curr.blogTitle]) acc[curr.blogTitle] = 0;
        if (curr.interested) acc[curr.blogTitle] += 1;
        return acc;
      },
      {},
    );

    res.json({
      totalInteractions: interactions.length,
      blogInterestStats: domainStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

export default router;
