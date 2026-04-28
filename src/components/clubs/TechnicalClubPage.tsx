"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconEdit = ({ size = 10 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.121 2.121 0 000-3l-1-1a2.121 2.121 0 00-3 0L4 16v4z"
    />
  </svg>
);
const IconPlus = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconBolt = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconUsers = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconPin = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const IconPerson = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconShield = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Tab = "events" | "challenges" | "members" | "macrothon";
type TeamMember = { name: string; role: string; tier: string };
type MacrothonType = {
  title: string;
  description: string;
  prize: string;
  deadline: string;
};

// Accepts any real-world club data shape — field normalization happens inside
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClubProp = Record<string, any>;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function EditBtn({
  label = "Edit",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono border transition-colors"
      style={{
        background: "rgba(192,38,211,0.10)",
        color: "#E879F9",
        borderColor: "rgba(192,38,211,0.35)",
      }}
    >
      <IconEdit />
      {label}
    </button>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const avatarStyle =
    member.tier === "president"
      ? { background: "rgba(192,38,211,0.25)", color: "#E879F9" }
      : member.tier === "vp"
        ? { background: "rgba(147,51,234,0.2)", color: "#C084FC" }
        : {
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          };

  return (
    <div
      className="flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors"
      style={{
        background: member.tier === "president" ? "#222232" : "#1B1B27",
        borderColor:
          member.tier === "president"
            ? "rgba(192,38,211,0.25)"
            : "rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
        style={avatarStyle}
      >
        {member.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate text-white">
          {member.name}
        </div>
        <div
          className="text-[11px] font-mono"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {member.role}
        </div>
      </div>
      {(member.tier === "president" || member.tier === "vp") && (
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={
            member.tier === "president"
              ? { background: "rgba(192,38,211,0.2)", color: "#E879F9" }
              : { background: "rgba(147,51,234,0.2)", color: "#C084FC" }
          }
        >
          {member.tier === "president" ? "PRES" : "VP"}
        </span>
      )}
    </div>
  );
}

const CLUB_THEMES: Record<string, any> = {
  aiml: {
    accent: "#C026D3",
    tagBg: "rgba(192,38,211,0.12)",
    tagText: "#E879F9",
    borderAccent: "rgba(192,38,211,0.35)",
  },

  devops: {
    accent: "#06B6D4",
    tagBg: "rgba(6,182,212,0.12)",
    tagText: "#67E8F9",
    borderAccent: "rgba(6,182,212,0.35)",
  },

  cyber: {
    accent: "#EF4444",
    tagBg: "rgba(239,68,68,0.12)",
    tagText: "#FCA5A5",
    borderAccent: "rgba(239,68,68,0.35)",
  },

  datascience: {
    accent: "#84CC16",
    tagBg: "rgba(132,204,22,0.12)",
    tagText: "#BEF264",
    borderAccent: "rgba(132,204,22,0.35)",
  },

  gdg: {
    accent: "#3B82F6",
    tagBg: "rgba(59,130,246,0.12)",
    tagText: "#93C5FD",
    borderAccent: "rgba(59,130,246,0.35)",
  },
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TechnicalClubPage({
  club: clubProp,
  phaseNo = 1,
}: {
  club?: string;
  phaseNo?: number;
}) {
  const CLUB_MAP: Record<string, number> = {
    aiml: 1,
    devops: 2,
    cyber: 3,
    datascience: 4,
    gdg: 5,
  };
  // Normalize incoming data — handles legacy field names from real data sources
  const API_BASE = "http://localhost:5000/api/club";

  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const rawStats = club?.stats || {};
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    points: 0,
  });

  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(
    null,
  );
  const [editedChallenge, setEditedChallenge] = useState({
    title: "",
    description: "",
    points: 0,
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const [editedEvent, setEditedEvent] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    speaker: "",
    status: "UPCOMING",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    speaker: "",
    status: "UPCOMING",
  });

  const [editingMacrothonId, setEditingMacrothonId] = useState<number | null>(
    null,
  );

  const [editedMacrothon, setEditedMacrothon] = useState({
    title: "",
    description: "",
    prize: "",
    startDate: "", // 🔥 NEW
    deadline: "",
  });
  const [newMacrothon, setNewMacrothon] = useState({
    title: "",
    description: "",
    prize: "",
    startDate: "", // 🔥 NEW
    deadline: "",
  });

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!clubProp) return;

    const clubId = CLUB_MAP[clubProp.toLowerCase()];

    if (!clubId) {
      console.error("Invalid club:", clubProp);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/${clubId}`)
      .then((res) => res.json())
      .then((data) => {
        setClub(data.club);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clubProp]);

  const theme = CLUB_THEMES[clubProp?.toLowerCase() || "aiml"];

  const C = {
    base: "#0C0C12",
    surface: "#13131C",
    surface2: "#1B1B27",
    surface3: "#222232",

    accent: theme?.accent || "#C026D3",
    tagBg: theme?.tagBg,
    tagText: theme?.tagText,
    borderAccent: theme?.borderAccent,

    muted: "rgba(255,255,255,0.45)",
    border: "rgba(255,255,255,0.07)",
    text: "#F0EFF8",
  };

  if (loading) return <div>Loading...</div>;
  if (!club) return <div>Error</div>;

  const TABS: {
    id: Tab;
    label: string;
    count: number;
    icon: React.ReactElement;
  }[] = [
    {
      id: "events",
      label: "Events",
      count: club.events?.length || 0,
      icon: <IconCalendar />,
    },
    {
      id: "challenges",
      label: "Challenges",
      count: club.challenges?.length || 0,
      icon: <IconBolt />,
    },
    {
      id: "members",
      label: "Members",
      count: club?.members?.length || 0,
      icon: <IconUsers />,
    },
    {
      id: "macrothon",
      label: "Macrothons",
      count: club.macrothons?.length || 0,
      icon: <IconPin />,
    },
  ];

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!club)
    return <div className="p-10 text-red-500">Failed to load club</div>;

  return (
    <div
      className="min-h-screen px-4 lg:px-16 py-12 mt-[60px]"
      style={{
        background: C.base,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href={`/phase${phaseNo}/technical-clubs`}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: C.muted }}
        >
          <IconArrowLeft />
          Technical Clubs
        </Link>

        {/* ADMIN TOGGLE */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full"
          style={{ background: C.surface2, border: `0.5px solid ${C.border}` }}
        >
          <span
            className="text-[11px] font-mono tracking-wide"
            style={{ color: isAdmin ? C.muted : C.tagText }}
          >
            VIEWER
          </span>
          <button
            onClick={() => setIsAdmin((v) => !v)}
            className="relative w-9 h-5 rounded-full transition-colors"
            style={{
              background: isAdmin ? C.accent : C.surface3,
              border: `0.5px solid ${isAdmin ? C.accent : C.border}`,
            }}
          >
            <span
              className="absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-white/90 transition-transform"
              style={{
                transform: isAdmin ? "translateX(16px)" : "translateX(0)",
              }}
            />
          </button>
          <span
            className="text-[11px] font-mono tracking-wide"
            style={{ color: isAdmin ? C.tagText : C.muted }}
          >
            ADMIN
          </span>
        </div>
      </div>

      {/* ── ADMIN BANNER ── */}
      {isAdmin && (
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl mb-6 text-[12px] font-mono"
          style={{
            background: "rgba(192,38,211,0.08)",
            border: `0.5px solid ${C.borderAccent}`,
            color: C.tagText,
          }}
        >
          <IconShield />
          ADMIN MODE — Edit controls are active across the page.
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section
        className="rounded-2xl overflow-hidden mb-8 relative"
        style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${C.accent}, #9333EA, transparent)`,
          }}
        />

        <div className="grid lg:grid-cols-[1fr_280px]">
          {/* LEFT */}
          <div className="p-8 lg:border-r" style={{ borderColor: C.border }}>
            <div className="flex items-start justify-between mb-5">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: C.tagBg,
                  border: `0.5px solid ${C.borderAccent}`,
                  color: C.tagText,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: C.tagText }}
                />
                TECHNICAL CLUB
              </span>
              {isAdmin && (
                <EditBtn
                  label="Edit Info"
                  onClick={async () => {
                    const name = prompt("Edit club name", club.name);
                    if (!name) return;

                    const res = await fetch(`${API_BASE}/${club.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...club,
                        name,
                      }),
                    });

                    const data = await res.json();
                    if (data.ok) setClub(data.club);
                  }}
                />
              )}
            </div>

            <h1
              className="font-bold leading-tight tracking-tight mb-2"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                color: C.text,
                letterSpacing: "-0.02em",
              }}
            >
              {club.name}
            </h1>

            <p className="text-sm font-medium mb-5" style={{ color: C.accent }}>
              {club.tagline}
            </p>

            <p
              className="text-[13.5px] leading-relaxed mb-7 max-w-xl"
              style={{ color: C.muted }}
            >
              {club.description}
            </p>

            {/* Focus areas */}
            <div className="mb-8">
              <div
                className="text-[10px] font-mono uppercase tracking-widest mb-3"
                style={{ color: C.muted }}
              >
                Focus Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {(club.focusAreas || []).map((area: string) => (
                  <span
                    key={area}
                    className="text-[12px] px-3 py-1 rounded-full"
                    style={{
                      background: C.surface3,
                      border: `0.5px solid ${C.border}`,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {area}
                  </span>
                ))}
                {isAdmin && (
                  <button
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-colors"
                    style={{
                      background: C.tagBg,
                      color: C.tagText,
                      borderColor: C.borderAccent,
                    }}
                  >
                    <IconPlus size={10} /> Add Tag
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { val: club?.members?.length || 0, label: "Members" },
                { val: club?.events?.length || 0, label: "Events" },
                {
                  val: club?.challenges?.length || 0,
                  label: "Active Challenges",
                },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-bold leading-none mb-1"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "1.75rem",
                      color: C.text,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="text-[11px] font-mono"
                    style={{ color: C.muted }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: core team */}
          <div className="p-6 flex flex-col gap-3 max-h-[440px] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: C.muted }}
              >
                Core Team
              </div>
              {isAdmin && <EditBtn label="Manage" />}
            </div>
            {(club.members || [])
              .filter((m: any) => m.tier !== "member")
              .map((m: TeamMember, i: number) => (
                <MemberCard key={`${m.name}-${i}`} member={m} />
              ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TABS
      ══════════════════════════════════════════════════ */}
      <div className="mb-6">
        <div
          className="inline-flex p-1 rounded-xl"
          style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all"
              style={{
                background: activeTab === tab.id ? C.surface3 : "transparent",
                color: activeTab === tab.id ? C.text : C.muted,
                border:
                  activeTab === tab.id
                    ? `0.5px solid ${C.borderAccent}`
                    : "0.5px solid transparent",
              }}
            >
              <span
                style={{ color: activeTab === tab.id ? C.tagText : "inherit" }}
              >
                {tab.icon}
              </span>
              {tab.label}
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeTab === tab.id ? C.tagBg : C.surface3,
                  color: activeTab === tab.id ? C.tagText : C.muted,
                  border: `0.5px solid ${activeTab === tab.id ? C.borderAccent : C.border}`,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TAB: EVENTS
      ══════════════════════════════════════════════════ */}
      {activeTab === "events" && (
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(club.events ?? []).map((ev: any, i: number) => {
            const isEditing = editingEventId === ev.id;

            return (
              <div
                key={ev.id ?? i}
                className="grid grid-cols-[1fr_auto] gap-4 items-center p-5 rounded-xl transition-colors"
                style={{
                  background: C.surface,
                  border: `0.5px solid ${C.border}`,
                }}
              >
                {/* LEFT */}
                <div>
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editedEvent.title}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                        className="px-3 py-2 rounded-full text-sm"
                        style={{ background: C.surface3, color: C.text }}
                      />

                      <div className="flex gap-2">
                        <input
                          value={editedEvent.date}
                          onChange={(e) =>
                            setEditedEvent({
                              ...editedEvent,
                              date: e.target.value,
                            })
                          }
                          placeholder="Date"
                          className="px-3 py-2 rounded-full text-sm w-full"
                          style={{ background: C.surface3, color: C.text }}
                        />
                        <input
                          value={editedEvent.time}
                          onChange={(e) =>
                            setEditedEvent({
                              ...editedEvent,
                              time: e.target.value,
                            })
                          }
                          placeholder="Time"
                          className="px-3 py-2 rounded-full text-sm w-full"
                          style={{ background: C.surface3, color: C.text }}
                        />
                      </div>

                      <input
                        value={editedEvent.venue}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            venue: e.target.value,
                          })
                        }
                        placeholder="Venue"
                        className="px-3 py-2 rounded-full text-sm"
                        style={{ background: C.surface3, color: C.text }}
                      />

                      <input
                        value={editedEvent.speaker}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            speaker: e.target.value,
                          })
                        }
                        placeholder="Speaker"
                        className="px-3 py-2 rounded-full text-sm"
                        style={{ background: C.surface3, color: C.text }}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex items-center gap-1.5 text-[11px] font-mono mb-2"
                        style={{ color: C.muted }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              ev.status === "UPCOMING" ? "#10B981" : C.muted,
                          }}
                        />
                        {ev.status} — {ev.date} · {ev.time}
                      </div>

                      <div
                        className="text-[15px] font-bold mb-3"
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          color: C.text,
                        }}
                      >
                        {ev.title}
                      </div>

                      <div className="flex gap-4">
                        <div
                          className="flex items-center gap-1.5 text-[12px]"
                          style={{ color: C.muted }}
                        >
                          <IconPin /> {ev.venue}
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-[12px]"
                          style={{ color: C.muted }}
                        >
                          <IconPerson /> {ev.speaker}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">
                  {isAdmin && (
                    <>
                      {isEditing ? (
                        <div className="flex gap-2">
                          {/* SAVE (UPDATE EXISTING) */}
                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.accent, color: "white" }}
                            onClick={async () => {
                              const res = await fetch(
                                `${API_BASE}/event/${ev.id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(editedEvent),
                                },
                              );

                              const data = await res.json();

                              if (data.ok) {
                                setClub((prev: any) => ({
                                  ...prev,
                                  events: prev.events.map((e: any) =>
                                    e.id === ev.id
                                      ? { ...e, ...editedEvent }
                                      : e,
                                  ),
                                }));

                                setEditingEventId(null);
                              }
                            }}
                          >
                            Save
                          </button>

                          {/* POST NEW EVENT */}

                          {/* CANCEL */}
                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.surface3, color: C.muted }}
                            onClick={() => setEditingEventId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <EditBtn
                          onClick={() => {
                            setEditingEventId(ev.id);
                            setEditedEvent(ev);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <div
              className="p-4 rounded-2xl flex flex-col gap-3 w-3/4 mx-auto"
              style={{
                background: C.surface,
                border: `0.5px solid ${C.borderAccent}`,
              }}
            >
              <input
                placeholder="Event Title"
                className="px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  placeholder="Date"
                  className="px-4 py-2 rounded-full text-sm w-full"
                  style={{
                    background: C.surface3,
                    border: `0.5px solid ${C.border}`,
                    color: C.text,
                  }}
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />

                <input
                  placeholder="Time"
                  className="px-4 py-2 rounded-full text-sm w-full"
                  style={{
                    background: C.surface3,
                    border: `0.5px solid ${C.border}`,
                    color: C.text,
                  }}
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Venue"
                className="px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newEvent.venue}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, venue: e.target.value })
                }
              />

              <input
                placeholder="Speaker"
                className="px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newEvent.speaker}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, speaker: e.target.value })
                }
              />

              <center>
                <button
                  className="flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    color: "#22c55e",
                    border: "0.5px solid #22c55e",
                    background: "transparent",
                  }}
                  onClick={async () => {
                    if (!newEvent.title) return;

                    const res = await fetch(`${API_BASE}/event`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...newEvent,
                        clubId: club.id,
                      }),
                    });

                    const data = await res.json();

                    if (data.ok) {
                      setClub((prev: any) => ({
                        ...prev,
                        events: [...prev.events, data.event],
                      }));

                      // reset form
                      setNewEvent({
                        title: "",
                        date: "",
                        time: "",
                        venue: "",
                        speaker: "",
                        status: "UPCOMING",
                      });
                    }
                  }}
                >
                  <IconPlus /> Post Event
                </button>
              </center>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: CHALLENGES
      ══════════════════════════════════════════════════ */}
      {activeTab === "challenges" && (
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(club.challenges ?? []).map((ch: any, i: number) => {
            const isEditing = editingChallengeId === ch.id;

            return (
              <div
                key={ch.id ?? i}
                className="grid grid-cols-[1fr_auto] gap-4 items-center p-5 rounded-xl transition-all"
                style={{
                  background: C.surface,
                  border: `0.5px solid ${C.border}`,
                }}
                onClick={() => {
                  if (!isEditing) window.location.href = "/bounty";
                }}
              >
                {/* LEFT SIDE */}
                <div>
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editedChallenge.title}
                        onChange={(e) =>
                          setEditedChallenge({
                            ...editedChallenge,
                            title: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-full text-sm outline-none"
                        style={{
                          background: C.surface3,
                          border: `0.5px solid ${C.border}`,
                          color: C.text,
                        }}
                      />

                      <textarea
                        value={editedChallenge.description}
                        onChange={(e) =>
                          setEditedChallenge({
                            ...editedChallenge,
                            description: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-xl text-sm outline-none"
                        style={{
                          background: C.surface3,
                          border: `0.5px solid ${C.border}`,
                          color: C.text,
                        }}
                      />

                      <input
                        type="number"
                        value={editedChallenge.points}
                        onChange={(e) =>
                          setEditedChallenge({
                            ...editedChallenge,
                            points: Number(e.target.value),
                          })
                        }
                        className="px-3 py-2 rounded-full text-sm outline-none"
                        style={{
                          background: C.surface3,
                          border: `0.5px solid ${C.border}`,
                          color: C.text,
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className="text-[15px] font-bold mb-1.5"
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          color: C.text,
                        }}
                      >
                        {ch.title}
                      </div>

                      <p
                        className="text-[12.5px] leading-relaxed mb-3"
                        style={{ color: C.muted }}
                      >
                        {ch.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(ch.tags ?? []).map((t: string, ti: number) => (
                          <span
                            key={`${t}-${ti}`}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{
                              background: C.surface3,
                              border: `0.5px solid ${C.border}`,
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT SIDE */}
                <div
                  className="flex flex-col items-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin && (
                    <>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.accent, color: "white" }}
                            onClick={async () => {
                              const res = await fetch(
                                `${API_BASE}/challenge/${ch.id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(editedChallenge),
                                },
                              );

                              const data = await res.json();

                              if (data.ok) {
                                setClub((prev: any) => ({
                                  ...prev,
                                  challenges: prev.challenges.map((c: any) =>
                                    c.id === ch.id
                                      ? { ...c, ...editedChallenge }
                                      : c,
                                  ),
                                }));

                                setEditingChallengeId(null);
                              }
                            }}
                          >
                            Save
                          </button>

                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.surface3, color: C.muted }}
                            onClick={() => setEditingChallengeId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <EditBtn
                          onClick={() => {
                            setEditingChallengeId(ch.id);
                            setEditedChallenge({
                              title: ch.title,
                              description: ch.description,
                              points: ch.points,
                            });
                          }}
                        />
                      )}
                    </>
                  )}

                  {!isEditing && (
                    <span
                      className="text-[13px] font-mono font-medium px-3 py-1.5 rounded-full"
                      style={{
                        background: C.tagBg,
                        border: `0.5px solid ${C.borderAccent}`,
                        color: C.tagText,
                      }}
                    >
                      {ch.points} pts
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <div
              className="p-4 rounded-2xl flex flex-col gap-3 w-3/4 justify-center  mx-auto"
              style={{
                background: C.surface,
                border: `0.5px solid ${C.borderAccent}`,
              }}
            >
              <input
                placeholder="Challenge Title"
                className="px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newChallenge.title}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, title: e.target.value })
                }
              />

              <textarea
                placeholder="Challenge Description"
                className="px-4 py-2 rounded-2xl text-sm outline-none"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newChallenge.description}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Points"
                className="px-4 py-2 rounded-full text-sm outline-none w-1/6"
                style={{
                  background: C.surface3,
                  border: `0.5px solid ${C.border}`,
                  color: C.text,
                }}
                value={newChallenge.points}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    points: Number(e.target.value),
                  })
                }
              />
              <center>
                <button
                  className="flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 w-1/6"
                  style={{
                    color: C.accent,
                    background: "transparent",
                    border: `0.5px solid ${C.accent}`,
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    if (!newChallenge.title) return;

                    const res = await fetch(`${API_BASE}/challenge`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...newChallenge,
                        clubId: club.id,
                        clubName: clubProp,
                      }),
                    });

                    const data = await res.json();

                    if (data.ok) {
                      setClub((prev: any) => ({
                        ...prev,
                        challenges: [...prev.challenges, data.challenge],
                      }));

                      // reset form
                      setNewChallenge({
                        title: "",
                        description: "",
                        points: 0,
                      });
                    }
                  }}
                >
                  <IconPlus /> Publish Challenge
                </button>
              </center>
            </div>
          )}
        </div>
      )}
      {activeTab === "macrothon" && (
        <div className="flex flex-col gap-3">
          {(club.macrothons ?? []).map((mc: any, i: number) => {
            const isEditing = editingMacrothonId === mc.id;

            return (
              <div
                key={mc.id ?? i}
                className="grid grid-cols-[1fr_auto] gap-4 items-center p-5 rounded-xl transition-all cursor-pointer"
                style={{
                  background: C.surface,
                  border: `0.5px solid ${C.border}`,
                }}
                onClick={() => {
                  if (!isEditing) window.location.href = "/macrothon";
                }}
              >
                {/* LEFT */}
                <div>
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editedMacrothon.title}
                        onChange={(e) =>
                          setEditedMacrothon({
                            ...editedMacrothon,
                            title: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-full text-sm"
                        style={{ background: C.surface3, color: C.text }}
                      />

                      <textarea
                        value={editedMacrothon.description}
                        onChange={(e) =>
                          setEditedMacrothon({
                            ...editedMacrothon,
                            description: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-xl text-sm"
                        style={{ background: C.surface3, color: C.text }}
                      />

                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={editedMacrothon.startDate}
                          onChange={(e) =>
                            setEditedMacrothon({
                              ...editedMacrothon,
                              startDate: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-full text-sm"
                          style={{ background: C.surface3, color: C.text }}
                        />

                        <input
                          type="date"
                          value={editedMacrothon.deadline}
                          onChange={(e) =>
                            setEditedMacrothon({
                              ...editedMacrothon,
                              deadline: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-full text-sm"
                          style={{ background: C.surface3, color: C.text }}
                        />

                        <input
                          type="date"
                          value={editedMacrothon.deadline}
                          onChange={(e) =>
                            setEditedMacrothon({
                              ...editedMacrothon,
                              deadline: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="text-[15px] font-bold mb-1.5"
                        style={{ color: C.text }}
                      >
                        {mc.title}
                      </div>

                      <p
                        className="text-[12.5px] mb-2"
                        style={{ color: C.muted }}
                      >
                        {mc.description}
                      </p>

                      <div className="flex gap-2 text-[11px] font-mono">
                        <span
                          className="px-2 py-1 rounded-full"
                          style={{
                            background: C.tagBg,
                            color: C.tagText,
                          }}
                        >
                          Prize: {mc.prize}
                        </span>

                        <span
                          className="px-2 py-1 rounded-full"
                          style={{
                            background: C.surface3,
                            color: C.muted,
                          }}
                        >
                          {mc.startDate
                            ? `${mc.startDate} → ${mc.deadline}`
                            : `Ends: ${mc.deadline}`}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div
                  className="flex flex-col items-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin && (
                    <>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.accent, color: "white" }}
                            onClick={async () => {
                              const res = await fetch(
                                `${API_BASE}/macrothon/${mc.id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(editedMacrothon),
                                },
                              );

                              const data = await res.json();

                              if (data.ok) {
                                setClub((prev: any) => ({
                                  ...prev,
                                  macrothons: prev.macrothons.map((m: any) =>
                                    m.id === mc.id
                                      ? { ...m, ...editedMacrothon }
                                      : m,
                                  ),
                                }));
                                setEditingMacrothonId(null);
                              }
                            }}
                          >
                            Save
                          </button>

                          <button
                            className="px-3 py-1 rounded-full text-[11px]"
                            style={{ background: C.surface3, color: C.muted }}
                            onClick={() => setEditingMacrothonId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <EditBtn
                          onClick={() => {
                            setEditingMacrothonId(mc.id);
                            setEditedMacrothon({
                              title: mc.title || "",
                              description: mc.description || "",
                              prize: mc.prize || "",
                              startDate: mc.startDate || "",
                              deadline: mc.deadline || "",
                            });
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* CREATE FORM */}
          {isAdmin && (
            <div
              className="p-4 rounded-2xl flex flex-col gap-3 w-3/4 mx-auto"
              style={{
                background: C.surface,
                border: `0.5px solid ${C.borderAccent}`,
              }}
            >
              {/* TITLE */}
              <input
                placeholder="Hackathon Title"
                value={newMacrothon.title}
                onChange={(e) =>
                  setNewMacrothon({ ...newMacrothon, title: e.target.value })
                }
                className="px-4 py-2 rounded-full text-sm"
                style={{ background: C.surface3, color: C.text }}
              />

              {/* DESCRIPTION */}
              <textarea
                placeholder="Description"
                value={newMacrothon.description}
                onChange={(e) =>
                  setNewMacrothon({
                    ...newMacrothon,
                    description: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-xl text-sm"
                style={{ background: C.surface3, color: C.text }}
              />

              {/* META */}
              <div className="flex gap-2">
                {/* PRIZE */}
                <input
                  placeholder="Prize"
                  value={newMacrothon.prize}
                  onChange={(e) =>
                    setNewMacrothon({ ...newMacrothon, prize: e.target.value })
                  }
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ background: C.surface3, color: C.text }}
                />

                {/* START DATE ✅ FIXED */}
                <input
                  type="date"
                  value={newMacrothon.startDate}
                  onChange={(e) =>
                    setNewMacrothon({
                      ...newMacrothon,
                      startDate: e.target.value,
                    })
                  }
                  className="px-3 py-2 rounded-full text-sm"
                  style={{ background: C.surface3, color: C.text }}
                />

                {/* DEADLINE ✅ FIXED */}
                <input
                  type="date"
                  value={newMacrothon.deadline}
                  onChange={(e) =>
                    setNewMacrothon({
                      ...newMacrothon,
                      deadline: e.target.value,
                    })
                  }
                  className="px-3 py-2 rounded-full text-sm"
                  style={{ background: C.surface3, color: C.text }}
                />
              </div>

              {/* SUBMIT */}
              <center>
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-80"
                  style={{
                    color: C.accent,
                    border: `0.5px solid ${C.accent}`,
                  }}
                  onClick={async () => {
                    if (
                      !newMacrothon.title ||
                      !newMacrothon.deadline ||
                      !newMacrothon.startDate
                    ) {
                      alert("Please fill all fields");
                      return;
                    }

                    if (newMacrothon.startDate > newMacrothon.deadline) {
                      alert("Start date cannot be after deadline");
                      return;
                    }

                    const res = await fetch(`${API_BASE}/macrothon`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...newMacrothon,
                        clubId: club.id, // ✅ ONLY THIS
                      }),
                    });

                    const data = await res.json();

                    if (data.ok) {
                      setClub((prev: any) => ({
                        ...prev,
                        macrothons: [...prev.macrothons, data.macrothon],
                      }));

                      // reset form
                      setNewMacrothon({
                        title: "",
                        description: "",
                        prize: "",
                        startDate: "",
                        deadline: "",
                      });
                    }
                  }}
                >
                  🚀 Post Macrothon
                </button>
              </center>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: MEMBERS
      ══════════════════════════════════════════════════ */}
      {activeTab === "members" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-mono" style={{ color: C.muted }}>
              {club?.members?.length || 0} active members
            </span>
            {isAdmin && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border transition-colors"
                style={{
                  background: C.tagBg,
                  color: C.tagText,
                  borderColor: C.borderAccent,
                }}
                onClick={async () => {
                  const res = await fetch(`${API_BASE}/member`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: "New Member",
                      role: "Member",
                      tier: "member",
                      clubId: club.id,
                    }),
                  });

                  const data = await res.json();

                  if (data.ok) {
                    setClub((prev: any) => ({
                      ...prev,
                      members: [...prev.members, data.member],
                    }));
                  }
                }}
              >
                <IconPlus size={10} /> Invite Members
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(club.members ?? []).map((m: any, i: number) => (
              <div
                key={`${m.name}-${i}`}
                className="p-5 rounded-xl text-center transition-colors"
                style={{
                  background: C.surface,
                  border: `0.5px solid ${m.tier === "president" ? "rgba(192,38,211,0.2)" : C.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3"
                  style={
                    m.tier === "president"
                      ? { background: "rgba(192,38,211,0.2)", color: "#E879F9" }
                      : m.tier === "vp"
                        ? {
                            background: "rgba(147,51,234,0.18)",
                            color: "#C084FC",
                          }
                        : {
                            background: C.surface3,
                            color: "rgba(255,255,255,0.7)",
                          }
                  }
                >
                  {m.name[0]}
                </div>
                <div
                  className="text-[14px] font-medium mb-0.5"
                  style={{ color: C.text }}
                >
                  {m.name}
                </div>
                <div
                  className="text-[11px] font-mono"
                  style={{ color: C.muted }}
                >
                  {m.role}
                </div>
                {editingMemberId === m.id ? (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <input
                      placeholder="Name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-3 py-1 rounded-full text-[11px] outline-none"
                      style={{
                        background: C.surface3,
                        border: `0.5px solid ${C.border}`,
                        color: C.text,
                      }}
                    />

                    <input
                      placeholder="Role"
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="px-3 py-1 rounded-full text-[11px] outline-none"
                      style={{
                        background: C.surface3,
                        border: `0.5px solid ${C.border}`,
                        color: C.text,
                      }}
                    />

                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded-full text-[10px] font-mono"
                        style={{
                          background: C.accent,
                          color: "white",
                        }}
                        onClick={async () => {
                          const res = await fetch(
                            `${API_BASE}/member/${m.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                role: editedRole,
                                name: editedName,
                              }),
                            },
                          );

                          const data = await res.json();

                          if (data.ok) {
                            setClub((prev: any) => ({
                              ...prev,
                              members: prev.members.map((mem: any) =>
                                mem.id === m.id
                                  ? {
                                      ...mem,
                                      role: editedRole,
                                      name: editedName,
                                    }
                                  : mem,
                              ),
                            }));

                            setEditingMemberId(null);
                          }
                        }}
                      >
                        Save
                      </button>

                      <button
                        className="px-3 py-1 rounded-full text-[10px] font-mono"
                        style={{
                          background: C.surface3,
                          color: C.muted,
                        }}
                        onClick={() => setEditingMemberId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  isAdmin && (
                    <div className="mt-3 flex justify-center">
                      <EditBtn
                        label="Edit Role"
                        onClick={() => {
                          setEditingMemberId(m.id);
                          setEditedRole(m.role);
                          setEditedName(m.name);
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
