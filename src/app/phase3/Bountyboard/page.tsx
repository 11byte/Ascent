"use client";

import { useEffect, useState } from "react";
import BountyBoard from "../../../components/BountyBoard";

// 🎨 Phase 3 Theme
const phase3Theme = {
  tBorder: { light: "#FCC61D", dark: "#FCC61D" },
  tColor: { light: "#3338A0", dark: "#3338A0" },
  tDepthColor: { light: "#b58004", dark: "#b58004" },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading bounties...
      </div>
    );
  }

  return (
    <BountyBoard
      theme={phase3Theme}
      defaultBounties={[]} // ❌ removed static
      clubBounties={bounties} // ✅ dynamic
    />
  );
}
