import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- THEME TYPE ---
interface TrackerTheme {
  tBorder: { light: string; dark: string };
  tColor: { light: string; dark: string };
  tDepthColor: { light: string; dark: string };
}

// --- GLASSY CARD ---
const GlassCard = ({
  children,
  theme,
  className = "",
}: {
  children: React.ReactNode;
  theme: TrackerTheme;
  className?: string;
}) => (
  <motion.div
    className={`rounded-3xl shadow-xl backdrop-blur-xl p-8 ${className}`}
    style={{
      border: `2px solid ${theme.tBorder.light}`,
      background: `linear-gradient(135deg, ${theme.tDepthColor.light}88 0%, #fff4 100%)`,
      color: theme.tColor.light,
      boxShadow: `0 12px 40px -12px ${theme.tBorder.light}`,
    }}
    initial={{ opacity: 0, scale: 0.96, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    layout
  >
    {children}
  </motion.div>
);

// --- PHASE-BASED TIPS ---
const githubTips: Record<string, { title: string; tips: string[] }> = {
  phase1: {
    title: "Git & GitHub Basics: Your Local Repository",
    tips: [
      "Configure your identity: `git config --global user.name \"Your Name\"`",
      "Set your email: `git config --global user.email \"you@example.com\"`",
      "Clone a repo: `git clone <repository-url>`",
      "Check changes: `git status`",
      "Stage files: `git add .`",
      "Commit work: `git commit -m \"Message\"`",
      "Push to GitHub: `git push`",
      "Pull changes: `git pull`",
      "View history: `git log --oneline`",
      "Create an Issue to report bugs or ideas.",
    ],
  },
  phase2: {
    title: "Branching & Teamwork",
    tips: [
      "Create a branch: `git switch -c new-feature`",
      "Switch branches: `git switch main`",
      "Merge: `git merge new-feature`",
      "Fork and PR: Fork on GitHub, propose a PR.",
      "Add a LICENSE file for your repo.",
      "Use `.gitignore` for unwanted files.",
    ],
  },
  phase3: {
    title: "Clean History & Advanced Workflow",
    tips: [
      "Add upstream remote: `git remote add upstream <original-url>`",
      "Sync fork: `git fetch upstream` + `git rebase upstream/main`",
      "Squash with rebase: `git rebase -i HEAD~3`",
      "Stash changes: `git stash` & `git stash pop`",
      "Track large files: `git lfs track \"*.mp4\"`",
      "Commit `.gitattributes`: `git add .gitattributes`",
    ],
  },
  phase4: {
    title: "Automation & Open Source Mastery",
    tips: [
      "Find buggy commit: `git bisect start`",
      "Automate with GitHub Actions in `.github/workflows`",
      "Use Git Hooks for pre-commit scripts.",
      "Tag releases: `git tag -a v1.0 -m \"Release\"`",
      "Push tags: `git push --tags`",
      "Contribute to issues labeled 'good first issue'.",
    ],
  },
};

// --- INTEREST PREDICTION BASED ON LANGUAGE ---
function getInterestTag(lang: string) {
  switch (lang) {
    case "Python":
      return "🐍 Pythonista! Try Machine Learning or Web Development.";
    case "JavaScript":
      return "⚡ Frontend/Backend wizard—JavaScript rules the web!";
    case "TypeScript":
      return "🔷 Type-safe web architect!";
    case "C++":
      return "🚀 High performance, systems, or competitive coding!";
    case "Java":
      return "📱 Android dev or Enterprise pro?";
    case "Go":
      return "🌐 Cloud, networking, fast APIs—Go for scale!";
    case "Rust":
      return "🦀 Rustacean! Safe, speedy systems.";
    default:
      return "";
  }
}

// --- UTILS ---
function getTopLanguage(repos: any[]) {
  const langCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
  });
  let topLang = "";
  let topCount = 0;
  Object.entries(langCount).forEach(([lang, count]) => {
    if (count > topCount) {
      topLang = lang;
      topCount = count;
    }
  });
  return topLang;
}
function getLanguagePieData(repos: any[]) {
  const langCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
  });
  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ label: lang, value: count }));
}
function getRecentPRs(events: any[]) {
  return events.filter((ev: any) => ev.type === "PullRequestEvent");
}
function getRecentIssues(events: any[]) {
  return events.filter((ev: any) => ev.type === "IssuesEvent");
}
function getRecentPushes(events: any[]) {
  return events.filter((ev: any) => ev.type === "PushEvent");
}
function getStarredRepos(repos: any[]) {
  return repos.filter((repo) => repo.stargazers_count > 0);
}
function getBadges(ghData: any) {
  const badges: { emoji: string; label: string }[] = [];
  if (ghData.user.public_repos >= 10)
    badges.push({ emoji: "🥇", label: "10+ Repos" });
  if (ghData.user.followers >= 5)
    badges.push({ emoji: "🌟", label: "5+ Followers" });
  if (getRecentPRs(ghData.events).length >= 5)
    badges.push({ emoji: "🚀", label: "Active PR Contributor" });
  if (getStarredRepos(ghData.repos).length >= 5)
    badges.push({ emoji: "⭐", label: "Star Collector" });
  return badges;
}

// --- DONUT CHART ---
function DonutChart({ data, theme }: { data: { label: string; value: number }[]; theme: TrackerTheme }) {
  if (data.length === 0) return null;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const colors = [
    theme.tColor.light,
    theme.tBorder.light,
    theme.tDepthColor.light,
    "#2b6cb0",
    "#38a169",
    "#ed8936",
    "#d53f8c",
    "#805ad5",
  ];
  return (
    <svg width={180} height={180} viewBox="0 0 36 36" style={{ margin: '0 auto', display: 'block' }}>
      {data.map((d, idx) => {
        const startAngle = (cumulative / total) * 2 * Math.PI;
        cumulative += d.value;
        const endAngle = (cumulative / total) * 2 * Math.PI;
        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = 18 + 16 * Math.cos(startAngle);
        const y1 = 18 + 16 * Math.sin(startAngle);
        const x2 = 18 + 16 * Math.cos(endAngle);
        const y2 = 18 + 16 * Math.sin(endAngle);
        const pathData = [
          `M 18 18`,
          `L ${x1} ${y1}`,
          `A 16 16 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`,
        ].join(" ");
        return (
          <motion.path
            key={d.label}
            d={pathData}
            fill={colors[idx % colors.length]}
            stroke="#fff"
            strokeWidth={0.5}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.13 }}
          >
            <title>
              {d.label}: {d.value}
            </title>
          </motion.path>
        );
      })}
      <circle cx={18} cy={18} r={8} fill="#fff" opacity={0.9} />
      <text x={18} y={20} textAnchor="middle" fontSize={7} fontWeight={600} fill={theme.tBorder.light}>
        Top {data[0]?.label}
      </text>
    </svg>
  );
}

// --- MAIN COMPONENT ---
export default function GitHubTracker({
  githubToken,
  userId,
  theme,
  phase = "phase1",
}: {
  githubToken: string;
  userId: string;
  theme: TrackerTheme;
  phase?: "phase1" | "phase2" | "phase3" | "phase4";
}) {
  const [loading, setLoading] = useState(true);
  const [ghData, setGhData] = useState<any>(null);
  const [error, setError] = useState("");
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    async function fetchGitHubInfo() {
      try {
        const userRes = await fetch("https://api.github.com/user", {
          headers: { Authorization: `token ${githubToken}` },
        });
        const user = await userRes.json();

        const reposRes = await fetch(
          "https://api.github.com/user/repos?per_page=100",
          { headers: { Authorization: `token ${githubToken}` } }
        );
        const repos = await reposRes.json();

        const eventsRes = await fetch(
          `https://api.github.com/users/${user.login}/events?per_page=30`,
          { headers: { Authorization: `token ${githubToken}` } }
        );
        const events = await eventsRes.json();

        setGhData({ user, repos, events });
      } catch (err) {
        setError("Failed to fetch GitHub data.");
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubInfo();
  }, [githubToken]);

  if (loading) {
    return (
      <GlassCard theme={theme} className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            border: `4px solid ${theme.tBorder.light}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
          className="w-16 h-16"
        />
      </GlassCard>
    );
  }
  if (error) return <GlassCard theme={theme}>{error}</GlassCard>;
  if (!ghData) return <GlassCard theme={theme}>No GitHub data found.</GlassCard>;

  const topLang = getTopLanguage(ghData.repos);
  const interestTag = getInterestTag(topLang);
  const tips = githubTips[phase];
  const pieData = getLanguagePieData(ghData.repos);
  const starredRepos = getStarredRepos(ghData.repos);
  const badges = getBadges(ghData);

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      {/* Glassy Profile + Badges */}
      <GlassCard theme={theme} className="flex flex-col items-center mb-2 relative overflow-visible">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <motion.img
            src={ghData.user.avatar_url}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          />
        </div>
        <div className="mt-14 text-center">
          <h2 className="text-3xl font-bold tracking-wide" style={{ color: theme.tColor.light }}>
            {ghData.user.name || ghData.user.login}
          </h2>
          <a
            href={ghData.user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-base"
            style={{ color: theme.tBorder.light }}
          >
            @{ghData.user.login}
          </a>
        </div>
        <div className="flex space-x-6 mt-6 text-lg font-semibold justify-center">
          <span>Repos: {ghData.user.public_repos}</span>
          <span>Followers: {ghData.user.followers}</span>
          <span>Following: {ghData.user.following}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {badges.map((badge, idx) => (
            <span
              key={badge.label}
              className="px-4 py-2 rounded-xl font-bold shadow"
              style={{
                background: theme.tBorder.light,
                color: theme.tDepthColor.light,
                fontSize: "1.1em",
              }}
            >
              {badge.emoji} {badge.label}
            </span>
          ))}
        </div>
        {ghData.user.bio && (
          <motion.p
            className="mt-3 text-base opacity-80 text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {ghData.user.bio}
          </motion.p>
        )}
        {topLang && (
          <motion.div
            className="mt-6 text-center text-lg font-semibold"
            style={{ color: theme.tColor.dark }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {interestTag}
          </motion.div>
        )}
      </GlassCard>

      {/* Donut Language Chart + Animated Breakdown */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <GlassCard theme={theme} className="flex-1 flex flex-col items-center">
          <h3 className="text-xl font-extrabold mb-2 tracking-wide">Your Language Palette</h3>
          <DonutChart data={pieData} theme={theme} />
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {pieData.map((d, idx) => (
              <motion.span
                key={d.label}
                className="mb-1 px-3 py-1 rounded-full font-bold shadow"
                style={{
                  background: idx % 2 === 0 ? theme.tBorder.light : theme.tColor.light,
                  color: theme.tDepthColor.light,
                  fontSize: "1em",
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 + 0.2 }}
              >
                {d.label} ({d.value})
              </motion.span>
            ))}
          </div>
        </GlassCard>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <GlassCard theme={theme} className="min-w-[160px] text-center">
            <strong>Most Used Language:</strong>
            <div className="mt-2 text-2xl font-extrabold" style={{ color: theme.tBorder.light }}>
              {topLang || "N/A"}
            </div>
          </GlassCard>
          <GlassCard theme={theme} className="min-w-[160px] text-center">
            <strong>Recent PRs:</strong>
            <div className="mt-2 text-2xl font-extrabold">{getRecentPRs(ghData.events).length}</div>
          </GlassCard>
          <GlassCard theme={theme} className="min-w-[160px] text-center">
            <strong>Recent Issues:</strong>
            <div className="mt-2 text-2xl font-extrabold">{getRecentIssues(ghData.events).length}</div>
          </GlassCard>
          <GlassCard theme={theme} className="min-w-[160px] text-center">
            <strong>Starred Repos:</strong>
            <div className="mt-2 text-2xl font-extrabold">{starredRepos.length}</div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Activity Timeline with Animated Cards */}
      <GlassCard theme={theme} className="mb-6">
        <h3 className="text-xl font-bold mb-3">Recent Activity Timeline</h3>
        <div className="flex flex-wrap gap-4">
          {(showAllEvents ? ghData.events : ghData.events.slice(0, 7)).map((ev: any, idx: number) => (
            <motion.div
              key={idx}
              className="rounded-xl px-4 py-2 shadow-lg"
              style={{
                background: theme.tBorder.light,
                color: theme.tDepthColor.light,
                minWidth: 180,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.09 }}
            >
              <span className="font-bold">
                {ev.type.replace("Event", "")}
              </span>{" "}
              <span>
                on{" "}
                <a
                  href={`https://github.com/${ev.repo?.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.tColor.light, fontWeight: 700 }}
                >
                  {ev.repo?.name}
                </a>
              </span>
              {ev.type === "PullRequestEvent" && ev.payload?.action && (
                <> ({ev.payload.action} PR)</>
              )}
              {ev.type === "IssuesEvent" && ev.payload?.action && (
                <> ({ev.payload.action} Issue)</>
              )}
              {ev.type === "PushEvent" && ev.payload?.commits?.length && (
                <> ({ev.payload.commits.length} commits)</>
              )}
            </motion.div>
          ))}
        </div>
        {ghData.events.length > 7 && (
          <button
            className="mt-6 px-5 py-2 rounded-full font-bold shadow"
            style={{
              background: theme.tBorder.light,
              color: theme.tDepthColor.light,
              fontWeight: 600,
            }}
            onClick={() => setShowAllEvents(!showAllEvents)}
          >
            {showAllEvents ? "Show Less" : "Show More"}
          </button>
        )}
      </GlassCard>

      {/* Starred Repos Section */}
      <GlassCard theme={theme} className="mb-6">
        <h3 className="text-xl font-bold mb-2">Your Top Starred Repositories</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {starredRepos.length === 0 && <span>No starred repos found!</span>}
          {starredRepos.slice(0, 10).map((repo: any, idx: number) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl font-bold shadow cursor-pointer"
              style={{
                background: theme.tColor.light,
                color: theme.tDepthColor.light,
                textDecoration: "none",
                fontSize: "1em",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07 }}
            >
              ⭐ {repo.name}
            </motion.a>
          ))}
        </div>
      </GlassCard>

      {/* Phase Tips - Animated Accordion */}
      <GlassCard theme={theme} className="mb-6">
        <motion.h3
          className="text-2xl font-bold mb-4"
          style={{ color: theme.tColor.light }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {tips.title}
        </motion.h3>
        <ul className="list-none space-y-3">
          {tips.tips.map((tip, idx) => (
            <motion.li
              key={idx}
              className="rounded-lg px-4 py-2 font-semibold"
              style={{
                background: idx % 2 === 0 ? theme.tBorder.light : theme.tColor.light,
                color: theme.tDepthColor.light,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 + 0.1 }}
            >
              {tip.startsWith("`") ? (
                <code className="bg-gray-200 px-2 py-1 rounded">
                  {tip.replace(/`/g, "")}
                </code>
              ) : (
                tip
              )}
            </motion.li>
          ))}
        </ul>
        <div className="mt-4 text-sm font-semibold" style={{ color: theme.tBorder.light }}>
          <span role="img" aria-label="rocket">🚀</span> Progress through phases to unlock advanced Git & GitHub skills!
        </div>
      </GlassCard>
    </div>
  );
}