import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/phase2/githubtracker"; // your frontend redirect URL

/* =====================================================
   TEMPORARY AUTH MIDDLEWARE (Skip real verification)
===================================================== */
function verifyToken(req: Request, res: Response, next: Function) {
  try {
    console.log("🧪 Skipping JWT verification for testing");
    // Pretend the logged-in user has ID = 1
    (req as any).user = { id: 1 };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
}

/* =====================================================
   1️⃣ Signup Route
===================================================== */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { email, name: name ?? "", password: hash },
      select: { id: true, email: true, name: true },
    });

    res.status(201).json({ ok: true, message: "User created", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   2️⃣ Login Route
===================================================== */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/github/data/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username)
      return res.status(400).json({ error: "GitHub username required" });

    // Fetch GitHub user info
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!userResponse.ok) {
      const msg = await userResponse.text();
      return res.status(userResponse.status).json({ error: msg });
    }
    const userData = await userResponse.json();

    // Fetch user's public repos
    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = await repoResponse.json();

    res.json({ ok: true, user: userData, repos });
  } catch (err) {
    console.error("GitHub fetch error:", err);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

router.get("/leetcode/:username", async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Public LeetCode Stats API (no authentication required)
    const response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch LeetCode data" });
    }

    const data = await response.json();

    // Structure the data for frontend clarity
    const formatted = {
      username: data.username || username,
      totalSolved: data.totalSolved || 0,
      totalQuestions: data.totalQuestions || 0,
      easySolved: data.easySolved || 0,
      totalEasy: data.totalEasy || 0,
      mediumSolved: data.mediumSolved || 0,
      totalMedium: data.totalMedium || 0,
      hardSolved: data.hardSolved || 0,
      totalHard: data.totalHard || 0,
      ranking: data.ranking || "N/A",
      contributionPoints: data.contributionPoints || 0,
      reputation: data.reputation || 0,
    };

    return res.json(formatted);
  } catch (err) {
    console.error("LeetCode API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
