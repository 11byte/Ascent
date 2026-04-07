import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import {
  roadmapService,
  resourceService,
} from "../services/roadmap.service.js";

function normalizeTopic(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSimilarity(a: string, b: string) {
  const aTokens = new Set(a.split(" ").filter(Boolean));
  const bTokens = new Set(b.split(" ").filter(Boolean));

  if (aTokens.size === 0 || bTokens.size === 0) return 0;

  const intersection = [...aTokens].filter((t) => bTokens.has(t)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
}

export const generateRoadmap = async (req: Request, res: Response) => {
  try {
    const { query, model, apiKey, mode, userId } = req.body;

    if (!query || !userId) {
      return res
        .status(400)
        .json({ status: false, message: "Query and userId are required" });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { id: true, roadmap_credits: true },
    });
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    // 1. Check cached roadmap for this user first to avoid regeneration costs.
    const normalizedQuery = normalizeTopic(query);
    const userRoadmaps = await prisma.roadmap.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const existing = userRoadmaps.find((roadmap) => {
      const normalizedTitle = normalizeTopic(roadmap.title);

      if (normalizedTitle === normalizedQuery) return true;
      if (normalizedTitle.includes(normalizedQuery)) return true;
      if (normalizedQuery.includes(normalizedTitle)) return true;

      return tokenSimilarity(normalizedTitle, normalizedQuery) >= 0.8;
    });

    if (existing) {
      await prisma.roadmap.update({
        where: { id: existing.id },
        data: { searchCount: { increment: 1 } },
      });
      return res.json({
        status: true,
        tree: JSON.parse(existing.content),
        roadmapId: existing.id,
        fromCache: true,
        remainingCredits: user.roadmap_credits,
      });
    }

    if (mode === "credits" && user.roadmap_credits < 100) {
      return res
        .status(403)
        .json({ status: false, message: "Insufficient credits" });
    }

    // 3. Generate content
    const activeKey = mode === "personal" ? apiKey : process.env.GEMINI_API_KEY;
    const tree = await roadmapService.generateAIContent(
      query,
      activeKey,
      model || "gemini-3-flash-preview",
    );

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

    const updatedUser = await prisma.user.findUnique({
      where: { userId },
      select: { roadmap_credits: true },
    });

    return res
      .status(200)
      .json({
        status: true,
        tree,
        roadmapId: finalResult.id,
        fromCache: false,
        remainingCredits: updatedUser?.roadmap_credits,
      });
  } catch (error) {
    console.error("Express Roadmap Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Roadmap generation failed." });
  }
};

// send list of id,name of all roadmaps in database, sorted by createdAt desc
export const getAllRoadmaps = async (req: Request, res: Response) => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ status: true, roadmaps });
  } catch (error) {
    console.error("Express Get All Roadmaps Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch roadmaps." });
  }
};

// get roadmap by id
export const getRoadmapById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: Number(id) },
    });
    if (!roadmap)
      return res
        .status(404)
        .json({ status: false, message: "Roadmap not found." });
    return res.status(200).json({
      status: true,
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        content: JSON.parse(roadmap.content),
      },
    });
  } catch (error) {
    console.error("Express Get Roadmap By ID Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch roadmap." });
  }
};

export const getModuleResources = async (req: Request, res: Response) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res
        .status(400)
        .json({ status: false, message: "Topic is required" });
    }

    // Fetch both in parallel for speed
    const [videos, books] = await Promise.all([
      resourceService.getYouTubeVideos(topic as string),
      resourceService.getBooks(topic as string),
    ]);

    return res.status(200).json({
      status: true,
      resources: {
        videos,
        books,
      },
    });
  } catch {
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch resources" });
  }
};
