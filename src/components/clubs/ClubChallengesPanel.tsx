"use client";

import { useState } from "react";
import { Plus, ExternalLink } from "lucide-react";

export default function ClubChallengesPanel({
  challenges = [],
  submissions = [],
}: any) {
  const [activeTab, setActiveTab] = useState("challenges");
  const [openModal, setOpenModal] = useState(false);

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    difficulty: "Medium",
    points: 100,
  });

  const handleCreate = () => {
    console.log("NEW CHALLENGE:", newChallenge);
    setOpenModal(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-5 py-2 rounded-full text-sm ${
            activeTab === "challenges"
              ? "bg-fuchsia-400 text-black"
              : "text-gray-400"
          }`}
        >
          Challenges
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-5 py-2 rounded-full text-sm ${
            activeTab === "submissions"
              ? "bg-fuchsia-400 text-black"
              : "text-gray-400"
          }`}
        >
          Submissions
        </button>
      </div>

      {/* ================= TAB 1 ================= */}
      {activeTab === "challenges" && (
        <>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Posted Challenges</h3>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-400 text-black text-sm"
            >
              <Plus size={14} />
              New Challenge
            </button>
          </div>

          {/* LIST */}
          <div className="grid gap-4">
            {challenges.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-gray-800 bg-gray-950"
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold">{c.title}</h4>
                  <span className="text-sm text-fuchsia-400">
                    {c.points} pts
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= TAB 2 ================= */}
      {activeTab === "submissions" && (
        <div className="grid gap-4">
          {submissions.map((s: any) => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-gray-800 bg-gray-950 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.challenge}</p>
                <p className="text-sm text-gray-400">by {s.user}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* LINK */}
                <a
                  href={s.link}
                  target="_blank"
                  className="text-fuchsia-400 flex items-center gap-1 text-sm"
                >
                  <ExternalLink size={14} />
                  View
                </a>

                {/* ACTIONS */}
                <button className="px-3 py-1 text-sm rounded-full bg-fuchsia-400 text-black">
                  Approve
                </button>

                <button className="px-3 py-1 text-sm rounded-full border border-fuchsia-400 text-fuchsia-400">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Challenge</h3>

            <input
              placeholder="Title"
              className="w-full mb-3 px-3 py-2 rounded bg-gray-800"
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full mb-3 px-3 py-2 rounded bg-gray-800"
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setOpenModal(false)}>Cancel</button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-fuchsia-400 text-black rounded-full"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
