import express from "express";
import axios from "axios";

const router = express.Router();

/* Difficulty classification */

function classifyDifficulty(title: string, description: string) {
  const text = (title + " " + description).toLowerCase();

  if (
    text.includes("architecture") ||
    text.includes("system design") ||
    text.includes("deep dive")
  )
    return "advanced";

  if (
    text.includes("build") ||
    text.includes("tutorial") ||
    text.includes("guide")
  )
    return "intermediate";

  return "beginner";
}

/* Academic weighting */

function academicScore(year: string, difficulty: string) {
  const map: any = {
    FE: { beginner: 1, intermediate: 0.7, advanced: 0.4 },
    SE: { beginner: 0.8, intermediate: 1, advanced: 0.6 },
    TE: { beginner: 0.6, intermediate: 1, advanced: 0.9 },
    BE: { beginner: 0.4, intermediate: 0.8, advanced: 1 },
  };

  return map[year]?.[difficulty] ?? 0.6;
}

/* Summary generator */

function generateSummary(text: string) {
  if (!text) return "Summary unavailable for this article.";

  const words = text.replace(/\s+/g, " ").trim().split(" ");

  const minWords = 80;
  const maxWords = 90;

  if (words.length <= minWords) {
    return words.join(" ") + "...";
  }

  const trimmed = words.slice(0, maxWords).join(" ");

  // try cutting at sentence boundary
  const lastPeriod = trimmed.lastIndexOf(".");

  if (lastPeriod > minWords * 3) {
    return trimmed.slice(0, lastPeriod + 1);
  }

  return trimmed + "...";
}

/* Image generator */

function generateImage(title: string) {
  const keyword = title.split(" ")[0];

  return `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=60`;
}

/* Remove duplicates */

function removeDuplicates(blogs: any[]) {
  const seen = new Set();

  return blogs.filter((blog) => {
    if (seen.has(blog.url)) return false;

    seen.add(blog.url);
    return true;
  });
}

/* Ranking */

function computeScore(blog: any, year: string) {
  const academicWeight = academicScore(year, blog.difficulty);

  const popularity =
    (blog.public_reactions_count || 0) * 0.6 + (blog.comments_count || 0) * 0.4;

  return academicWeight * 0.4 + popularity * 0.6;
}

router.get("/", async (req, res) => {
  try {
    const year = typeof req.query.year === "string" ? req.query.year : "FE";

    const response = await axios.get(
      "https://dev.to/api/articles?tag=technology&per_page=40",
    );

    let blogs = response.data.map((blog: any) => {
      const difficulty = classifyDifficulty(blog.title, blog.description || "");

      return {
        id: blog.id,
        title: blog.title,
        description: blog.description,
        summary: generateSummary(blog.description || ""),
        author: blog.user.name,
        published_at: blog.published_at,
        url: blog.url,
        cover_image: blog.cover_image || generateImage(blog.title),
        reactions: blog.public_reactions_count,
        comments: blog.comments_count,
        difficulty,
      };
    });

    blogs = removeDuplicates(blogs);

    blogs = blogs
      .map((b: any) => ({
        ...b,
        score: computeScore(b, year),
      }))
      .sort((a: any, b: any) => b.score - a.score);

    res.json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.post("/interact", async (req, res) => {
  const { title, interested, userId } = req.body;

  console.log({
    userId,
    title,
    interested,
    timestamp: Date.now(),
  });

  res.json({ success: true });
});

export default router;
