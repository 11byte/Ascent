import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { roadmapService } from "../services/roadmap.service";

export const generateRoadmap = async (req: Request, res: Response) => {
  try {
    const { query, model, apiKey, mode, userId } = req.body;

    // 1. Check for cached version
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
    const existing = await prisma.roadmap.findFirst({
      where: { title: { contains: normalizedQuery, mode: "insensitive" } },
    });

    if (existing) {
      await prisma.roadmap.update({ where: { id: existing.id }, data: { searchCount: { increment: 1 } } });
      return res.json({ status: true, tree: JSON.parse(existing.content), roadmapId: existing.id });
    }

    // 2. Credit check if using system mode
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (mode === "credits" && user.roadmap_credits < 100) {
      return res.status(403).json({ status: false, message: "Insufficient credits" });
    }

    // 3. Generate content
    const activeKey = mode === "personal" ? apiKey : process.env.GEMINI_API_KEY;
    const tree = await roadmapService.generateAIContent(query, activeKey, model || "gemini-3-flash-preview");

    // 4. Atomic Update: Save roadmap and decrement credits
    const finalResult = await prisma.$transaction(async (tx) => {
      const saved = await tx.roadmap.create({
        data: {
          title: query,
          content: JSON.stringify(tree),
          userId: user.id,
        },
      });

      if (mode === "credits") {
        await tx.user.update({
          where: { userId },
          data: { roadmap_credits: { decrement: 100 } },
        });
      }
      return saved;
    });

    return res.status(200).json({ status: true, tree, roadmapId: finalResult.id });
  } catch (error) {
    console.error("Express Roadmap Error:", error);
    return res.status(500).json({ status: false, message: "Roadmap generation failed." });
  }
};