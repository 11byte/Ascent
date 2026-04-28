"use client";

import { useEffect, useState } from "react";
import BountyBoard from "../../../components/BountyBoard";

// 🎨 Theme (unchanged)
const phase2Theme = {
  tBorder: {
    light: "#fcc7c7",
    dark: "#fcc7c7",
  },
  tColor: {
    dark: "#3B82F6",
    light: "#3B82F6",
  },
  tDepthColor: {
    dark: "#06B6D4",
    light: "#06B6D4",
  },
};

export default function Page() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllChallenges = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/club/challenges/all",
        );
        const data = await res.json();

        if (!data.ok) throw new Error("Failed");

        const formatted = data.challenges.map((ch: any) => ({
          id: ch.id,
          title: ch.title,
          domain: ch.clubName || ch.club?.name || "Club",
          points: ch.points,
          difficulty: ch.difficulty || "Medium",
          description: ch.description,
          createdBy: ch.club?.name || "Club",
        }));

        setBounties(formatted);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChallenges();
  }, []);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading bounties...
      </div>
    );
  }

  return (
    <BountyBoard
      theme={phase2Theme}
      defaultBounties={[]} // ❌ remove static
      clubBounties={bounties} // ✅ dynamic
    />
  );
}
