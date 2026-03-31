"use client";

import { useState } from "react";

export default function JoinClubDialog() {
  const [email, setEmail] = useState("");

  async function joinClub() {
    await fetch("/api/clubs/join", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    alert("Request submitted!");
  }

  return (
    <div className="mt-6 flex gap-3">
      <input
        placeholder="Enter email"
        className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={joinClub}
        className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
      >
        Request to Join
      </button>
    </div>
  );
}
