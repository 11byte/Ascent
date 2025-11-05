import { Router, Request, Response } from "express";
import { sendEventToKafka } from "../utils/producer";

const router = Router();

/* =====================================================
   3️⃣ GitHub Tracker Route — Fetch and Send to Kafka
===================================================== */
router.get("/github/data/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const userId = (req.query.userId as string) || "guest";

    if (!username) {
      return res.status(400).json({ error: "GitHub username required" });
    }

    console.log(`🧠 Fetching GitHub data for: ${username} (userId: ${userId})`);

    // ✅ Fetch GitHub user profile
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error(`❌ GitHub profile fetch failed: ${errorText}`);
      return res.status(userResponse.status).json({ error: errorText });
    }
    const userData = await userResponse.json();

    // ✅ Fetch repositories
    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    const repos = await repoResponse.json();

    // ✅ Fetch recent events (commits, pushes, stars, etc.)
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`
    );
    const events = await eventsResponse.json();

    console.log(`✅ GitHub data fetched successfully for ${username}`);

    // ✅ Construct payload for Kafka
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
          created_at: userData.created_at,
        },
        repos: repos.map((r: any) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          size: r.size,
          html_url: r.html_url,
          updated_at: r.updated_at,
        })),
        events: events.map((e: any) => ({
          type: e.type,
          repo: e.repo?.name,
          created_at: e.created_at,
          payload: e.payload,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    // ✅ Send to Kafka
    try {
      console.log(`🚀 Sending GitHub data to Kafka for user: ${userId}`);
      await sendEventToKafka(
        "github-tracker-events",
        userId,
        "githubTracker",
        payload
      );
      console.log(
        `📤 GitHub data successfully sent to Kafka (topic: github-tracker-events)`
      );
    } catch (kafkaErr) {
      console.error("⚠️ Kafka send failed:", kafkaErr);
    }

    // ✅ Respond to frontend (including events)
    res.status(200).json({
      ok: true,
      user: userData,
      repos,
      events,
    });
  } catch (err) {
    console.error("❌ GitHub fetch error:", err);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

export default router;
