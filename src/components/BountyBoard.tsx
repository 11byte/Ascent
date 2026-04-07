"use client";

import React, { useMemo, useState } from "react";
import { Trophy, Star, Search, X, Upload } from "lucide-react";

export default function BountyBoard({
  theme,
  defaultBounties,
  clubBounties,
}: any) {
  const [search, setSearch] = useState("");
  const [accepted, setAccepted] = useState<number[]>([]);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [submissionData, setSubmissionData] = useState({
    url: "",
    notes: "",
  });

  /* 🎨 THEME */
  const base = theme.tDepthColor.light; // PAGE BG
  const surface = theme.tBorder.light; // CARDS
  const accent = theme.tColor.light; // ACTIONS

  const all = [...defaultBounties, ...clubBounties];

  const filtered = useMemo(() => {
    return all.filter((b: any) =>
      b.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const acceptChallenge = (b: any) => {
    setAccepted((prev) => [...prev, b.id]);
    setSelected(b);
    setSubmissionOpen(true);
  };

  const submitSolution = () => {
    console.log("SUBMITTED:", submissionData);
    setSubmissionOpen(false);
  };

  function darkenColor(hex: string, percent: number) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);

    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return `#${(
      0x1000000 +
      (R < 0 ? 0 : R) * 0x10000 +
      (G < 0 ? 0 : G) * 0x100 +
      (B < 0 ? 0 : B)
    )
      .toString(16)
      .slice(1)}`;
  }

  const darkerBase = darkenColor(base, 55); // 25% darker
  return (
    <div
      className="min-h-screen px-6 pb-12"
      style={{
        paddingTop: "100px",
        background: darkerBase,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold flex items-center gap-3 font-[Orbitron]">
            <Trophy style={{ color: "#fff" }} />
            <span style={{ color: "#fff" }}>Bounty Board</span>
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Solve challenges and earn points
          </p>
        </div>

        {/* SEARCH */}
        <div
          className="flex items-center px-4 py-3 rounded-2xl shadow-md mb-8"
          style={{
            background: "white",
          }}
        >
          <Search size={16} style={{ color: accent }} />
          <input
            placeholder="Search challenges..."
            className="ml-2 w-full outline-none text-sm bg-transparent"
            style={{ color: "#000" }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b: any) => (
            <div
              key={b.id}
              className="rounded-2xl overflow-hidden shadow-lg transition hover:shadow-xl"
              style={{
                background: surface,
              }}
            >
              {/* CONTENT */}
              <div className="p-5">
                {/* TAGS (LEFT ALIGNED) */}
                <div className="flex gap-2 mb-3">
                  <span
                    className="text-xs px-3 py-1 rounded-4xl"
                    style={{
                      color: base,
                      border: `1px solid ${base}`,
                      background: "white",
                    }}
                  >
                    {b.difficulty}
                  </span>

                  <span
                    className="text-xs px-3 py-1 rounded-4xl"
                    style={{
                      color: "white",
                      background: base,
                    }}
                  >
                    {b.domain}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-base mb-2 text-black">
                  {b.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-black/70 mb-4 line-clamp-2">
                  {b.description}
                </p>

                {/* POINTS */}
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star size={14} style={{ color: accent }} />
                  <span style={{ color: accent }}>{b.points}</span>
                </div>
              </div>

              {/* ACTION SECTION (FULL WIDTH) */}
              {!accepted.includes(b.id) ? (
                <div
                  onClick={() => acceptChallenge(b)}
                  className="w-full py-3 text-center text-sm font-medium cursor-pointer transition-all"
                  style={{
                    background: "transparent",
                    color: darkenColor(accent, 50),
                    borderTop: `1px solid ${darkenColor(accent, 50)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = accent;
                    e.currentTarget.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = darkenColor(accent, 50);
                  }}
                >
                  Accept Challenge
                </div>
              ) : (
                <div
                  onClick={() => {
                    setSelected(b);
                    setSubmissionOpen(true);
                  }}
                  className="w-full py-3 text-center text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
                  style={{
                    background: base,
                    color: "#fff",
                  }}
                >
                  <Upload size={14} />
                  Submit Solution
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MODAL */}
        {submissionOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div
              className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
              style={{
                background: surface,
              }}
            >
              <div className="flex justify-between mb-5">
                <h2 style={{ color: accent }} className="font-semibold">
                  Submit Solution
                </h2>

                <X
                  className="cursor-pointer"
                  style={{ color: base }}
                  onClick={() => setSubmissionOpen(false)}
                />
              </div>

              <input
                placeholder="GitHub / Live Link"
                className="w-full px-3 py-2 rounded-xl mb-3 outline-none"
                style={{
                  background: base,
                  color: "#fff",
                }}
              />

              <textarea
                placeholder="Optional notes..."
                className="w-full px-3 py-2 rounded-xl mb-5 outline-none"
                style={{
                  background: base,
                  color: "#fff",
                }}
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-5 py-2 rounded-4xl text-sm"
                  style={{
                    background: base,
                    color: "#fff",
                  }}
                  onClick={() => setSubmissionOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-6 py-2 rounded-4xl text-sm shadow-md"
                  style={{
                    background: accent,
                    color: "#000",
                  }}
                  onClick={submitSolution}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
