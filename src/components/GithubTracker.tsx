"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// ---------- INTERFACE ----------
interface TrackerTheme {
  tBorder: { light: string; dark: string };
  tColor: { light: string; dark: string };
  tDepthColor: { light: string; dark: string };
}

// ---------- REUSABLE CARD ----------
const GlassCard = ({
  children,
  theme,
  className = "",
  title,
}: {
  children: React.ReactNode;
  theme: TrackerTheme;
  className?: string;
  title?: string;
}) => (
  <motion.div
    className={`rounded-3xl shadow-xl backdrop-blur-xl p-6 ${className}`}
    style={{
      border: `2px solid ${theme.tBorder.light}`,
      background: `linear-gradient(135deg, ${theme.tDepthColor.light}33 0%, #ffffff22 100%)`,
      color: theme.tColor.light,
      boxShadow: `0 8px 25px -10px ${theme.tBorder.light}`,
    }}
    initial={{ opacity: 0, scale: 0.96, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
  >
    {title && <h3 className="text-lg font-bold mb-3">{title}</h3>}
    {children}
  </motion.div>
);

// ---------- MAIN COMPONENT ----------
export default function GitHubTracker({ theme }: { theme: TrackerTheme }) {
  const [username, setUsername] = useState("");
  const [ghData, setGhData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchGitHubInfo() {
    if (!username) return setError("Please enter a GitHub username.");
    setLoading(true);
    setError("");
    try {
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        fetch(`https://api.github.com/users/${username}/events?per_page=100`),
      ]);
      if (userRes.status === 404) throw new Error("User not found.");
      const user = await userRes.json();
      const repos = await reposRes.json();
      const events = await eventsRes.json();
      setGhData({ user, repos, events });
    } catch (err: any) {
      setError(err.message);
      setGhData(null);
    } finally {
      setLoading(false);
    }
  }

  // ---------- DATA PROCESSING ----------
  const COLORS = [
    "#6366F1",
    "#F43F5E",
    "#14B8A6",
    "#F59E0B",
    "#84CC16",
    "#EC4899",
    "#06B6D4",
    "#8B5CF6",
    "#10B981",
    "#F87171",
  ];

  const languages = ghData?.repos.reduce((acc: any, repo: any) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});
  const languageData = languages
    ? Object.entries(languages).map(([name, value]) => ({ name, value }))
    : [];

  const starsData = ghData?.repos
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((r: any) => ({ name: r.name, stars: r.stargazers_count }));

  const forksData = ghData?.repos
    .sort((a: any, b: any) => b.forks_count - a.forks_count)
    .slice(0, 10)
    .map((r: any) => ({ name: r.name, forks: r.forks_count }));

  const sizeDistribution = ghData?.repos.map((r: any) => ({
    name: r.name,
    size: r.size,
  }));

  const commitEvents = ghData?.events
    .filter((e: any) => e.type === "PushEvent")
    .reduce((acc: any, ev: any) => {
      const day = new Date(ev.created_at).toLocaleDateString();
      acc[day] = (acc[day] || 0) + ev.payload.size;
      return acc;
    }, {});
  const commitData = commitEvents
    ? Object.entries(commitEvents).map(([day, commits]) => ({ day, commits }))
    : [];

  const mostActiveRepos = Object.entries(
    ghData?.events
      .filter((e: any) => e.type === "PushEvent")
      .reduce((acc: any, e: any) => {
        const repo = e.repo.name;
        acc[repo] = (acc[repo] || 0) + 1;
        return acc;
      }, {}) || {}
  )
    .map(([name, pushes]) => ({ name, pushes }))
    .slice(0, 10);

  const openVsPrivate = ghData
    ? [
        { name: "Public", value: ghData.user.public_repos },
        {
          name: "Private (est.)",
          value: Math.floor(ghData.user.public_repos * 0.3),
        },
      ]
    : [];

  const starForkScatter = ghData?.repos.map((r: any) => ({
    stars: r.stargazers_count,
    forks: r.forks_count,
    size: r.size / 100,
    name: r.name,
  }));
  function darkenColor(hex: string, percent: number) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `rgb(${R}, ${G}, ${B})`;
  }

  // ---------- RENDER ----------
  return (
    <div
      className="p-8 rounded-4xl mx-auto"
      style={{
        backgroundColor: darkenColor(theme.tBorder.light, 75),
        width: "calc(100% - 20px)", // leaves 10px space on both left and right
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      {/* INPUT */}
      <GlassCard theme={theme} className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-3">
          GitHub Developer Insights
        </h2>
        <div className="flex justify-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-xl w-64 border text-cyan-100"
          />
          <motion.button
            onClick={fetchGitHubInfo}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-cyan-950"
            style={{ backgroundColor: theme.tBorder.light }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </motion.button>
        </div>
      </GlassCard>

      {error && <GlassCard theme={theme}>{error}</GlassCard>}

      {ghData && (
        <div className="grid grid-cols-12 gap-6 auto-rows-fr">
          {/* 1. Profile */}
          <GlassCard theme={theme} className="col-span-12 md:col-span-4">
            <div className="text-center">
              <img
                src={ghData.user.avatar_url}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
              />
              <h2 className="text-xl font-bold mt-3">{ghData.user.name}</h2>
              <p className="text-sm">@{ghData.user.login}</p>
              <p className="mt-2 font-semibold">
                {ghData.user.public_repos} Repos • {ghData.user.followers}{" "}
                Followers
              </p>
              <p className="italic text-xs mt-2">
                {ghData.user.bio || "No bio provided"}
              </p>
            </div>
          </GlassCard>

          {/* 2. Language Usage */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-4"
            title="Top Languages"
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={languageData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {languageData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 3. Commit Activity */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-4"
            title="Commit Frequency"
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={commitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" hide />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="commits"
                  stroke={theme.tColor.light}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 4. Stars */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-6"
            title="Top Starred Repositories"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={starsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stars" fill={theme.tBorder.light} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 5. Forks */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-6"
            title="Top Forked Repositories"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={forksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="forks" fill={theme.tColor.light} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 6. Repo Size */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-6"
            title="Repository Size Distribution (KB)"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sizeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="size" fill={theme.tDepthColor.light} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 7. Public vs Private */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-3"
            title="Repo Visibility"
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={openVsPrivate}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {openVsPrivate.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 8. Push Timeline */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-3"
            title="Recent Push Timeline"
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={commitData.slice(-10)}>
                <XAxis dataKey="day" hide />
                <YAxis />
                <Tooltip />
                <Line dataKey="commits" stroke={theme.tBorder.light} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 9. Most Active Repos */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-6"
            title="Most Active Repositories"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mostActiveRepos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pushes" fill={theme.tColor.light} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 10. Stars vs Forks */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-6"
            title="Stars vs Forks Scatter"
          >
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stars" name="Stars" />
                <YAxis dataKey="forks" name="Forks" />
                <ZAxis dataKey="size" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={starForkScatter}
                  fill={theme.tDepthColor.light}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* 11. Location */}
          <GlassCard
            theme={theme}
            className="col-span-12 md:col-span-3"
            title="Developer Location"
          >
            <p className="text-sm">
              🌍{" "}
              <strong>{ghData.user.location || "No location specified"}</strong>
            </p>
            <p className="text-xs mt-2">
              Joined GitHub:{" "}
              {new Date(ghData.user.created_at).toLocaleDateString("en-GB")}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
