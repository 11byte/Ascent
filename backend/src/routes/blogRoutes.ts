import { Router, Request, Response } from "express";
import { sendEvent } from "../utils/producer"; // Kafka producer
import { prisma } from "../utils/prisma"; // Prisma client

const router = Router();

/* =====================================================
   1️⃣ Fetch Blogs from Dev.to (Only)
===================================================== */
router.get("/blogs", async (_req: Request, res: Response) => {
  try {
    const devtoResponse = await fetch(
      "https://dev.to/api/articles?per_page=15"
    );
    if (!devtoResponse.ok)
      throw new Error(`Dev.to API failed with status ${devtoResponse.status}`);

    const devtoBlogs = (await devtoResponse.json()) as any[];

    const formattedBlogs = devtoBlogs.map((b) => ({
      id: b.id,
      title: b.title,
      content: b.description || "",
      author: b.user?.name || "Unknown",
      createdAt: new Date(b.published_at),
      domain: (b.tag_list && b.tag_list[0]) || "technology",
      source: "Dev.to",
      url: b.url,
      cover_image: b.cover_image || null,
    }));

    res.status(200).json({ ok: true, blogs: formattedBlogs });
  } catch (err) {
    console.error("❌ Error fetching Dev.to blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

/* =====================================================
   2️⃣ Track Blog Interaction (Interested / Not Interested)
   - Save in Postgres + send Kafka event
===================================================== */
router.post("/blogs/interact", async (req: Request, res: Response) => {
  try {
    const { title, interested, domain, userId } = req.body;

    if (!title || typeof interested !== "boolean") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // 1️⃣ Save to Postgres
    await prisma.blogInteraction.create({
      data: {
        blogTitle: title,
        interested,
        domain: domain || "general",
      },
    });

    // 2️⃣ Send Kafka event
    const payload = {
      title,
      interested,
      domain: domain || "general",
      userId: userId || null,
      timestamp: new Date().toISOString(),
    };

    await sendEvent("student.blog.interest", payload);
    console.log("📤 Saved & sent to Kafka:", payload);

    res.json({ ok: true, message: "Interaction saved and sent to Kafka" });
  } catch (err) {
    console.error("❌ Blog interaction error:", err);
    res.status(500).json({ error: "Failed to save interaction" });
  }
});

export default router;
