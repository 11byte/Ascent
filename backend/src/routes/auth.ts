import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEventToKafka } from "../utils/producer";

const router = Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/phase2/githubtracker";

/* =====================================================
   TEMPORARY AUTH MIDDLEWARE (Skip real verification)
===================================================== */
function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("🧪 Skipping JWT verification for testing");
    (req as any).user = { id: 1 }; // Simulate user
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
}

// helper to generate a random 6-character alphanumeric ID
function generateUserId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name, phase } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 12);

    // generate unique 6-char userId (retry if collision)
    let userId: string;
    while (true) {
      userId = generateUserId();
      const existingId = await prisma.user.findUnique({ where: { userId } });
      if (!existingId) break; // ensure uniqueness
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name ?? "",
        password: hash,
        phase: phase ?? "1",
        userId, // added line
      },
      select: {
        id: true,
        email: true,
        name: true,
        phase: true,
        userId: true, // optional: include in response
      },
    });

    res.status(201).json({
      ok: true,
      message: "User created",
      user: newUser,
    });
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

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        phase: true,
        userId: true,
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Generate JWT as before
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ Include phase in returned user object
    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phase: user.phase,
        userId: user.userId, // ✅ Added here
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   3️⃣ GitHub Data Fetch
===================================================== */
router.get("/github/data/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const userId = req.query.userId || "guest"; // optional param for context

    if (!username)
      return res.status(400).json({ error: "GitHub username required" });

    // ✅ Fetch GitHub user profile
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!userResponse.ok)
      return res
        .status(userResponse.status)
        .json({ error: await userResponse.text() });
    const userData = await userResponse.json();

    // ✅ Fetch repositories
    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = await repoResponse.json();
    console.log("github fetched");

    // ✅ Build the payload to send to Kafka
    const payload = {
      userId,
      github: {
        profile: {
          username: userData.login,
          name: userData.name,
          bio: userData.bio,
          followers: userData.followers,
          following: userData.following,
          public_repos: userData.public_repos,
          location: userData.location,
          avatar_url: userData.avatar_url,
          html_url: userData.html_url,
        },
        repos: repos.map((r: any) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          html_url: r.html_url,
          updated_at: r.updated_at,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    // ✅ Send data to Kafka
    try {
      await sendEventToKafka(
        "github-tracker-events",
        userId as string,
        "githubTracker",
        payload
      );
      console.log(`📤 Sent GitHub data for ${username} to Kafka pipeline`);
    } catch (kafkaErr) {
      console.error("⚠️ Kafka pipeline send failed:", kafkaErr);
    }

    // ✅ Finally, respond to frontend
    res.json({ ok: true, user: userData, repos });
  } catch (err) {
    console.error("❌ GitHub fetch error:", err);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});
/* =====================================================
   4️⃣ LeetCode Data Fetch
===================================================== */
router.get("/leetcode/:username", async (req: Request, res: Response) => {
  const { username } = req.params;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    if (!response.ok)
      return res.status(500).json({ error: "Failed to fetch LeetCode data" });

    const data = await response.json();

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
