"use client";

import TechnicalClubsPage from "../components/clubs/TechnicalClubsPage";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 🔥 Animated Gradient Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(-45deg,#ff9a9e,#fad0c4,#fbc2eb,#a18cd1)]
        bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10">
        <TechnicalClubsPage />
      </div>
    </main>
  );
}
