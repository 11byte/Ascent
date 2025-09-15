"use client";

import React, { useState } from "react";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Login failed");

      setMsg("✅ Logged in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/phase1";
      }, 1500);
    } catch (error: any) {
      setMsg(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f4f4f4] via-[#e6e6e6] to-[#dcdcdc] relative overflow-hidden">
      {/* Subtle metallic shine effect */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.6)_20%,transparent_50%,rgba(255,255,255,0.6)_80%)] opacity-40 animate-[metallicShimmer_6s_linear_infinite]" />

      <div className="w-full max-w-md px-6 relative z-10">
        <form
          onSubmit={handleLogin}
          className="bg-gradient-to-br from-[#f8f8f8] to-[#e6e6e6] backdrop-blur-xl rounded-3xl  shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 border border-gray-200"
        >
          <div className="text-zinc-800 font-[Orbitron] text-4xl w-full mb-[50px]">
            <center>
              {" "}
              <h3 className="my-1.5">Ascent</h3>
            </center>
          </div>
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full rounded-xl px-4 py-3 mb-5 bg-white/80 border border-gray-300 outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition text-zinc-700 shadow-inner"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full rounded-xl px-4 py-3 mb-6 bg-white/80 border border-gray-300 outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition text-zinc-700 shadow-inner"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <center>
            <button
              type="submit"
              disabled={loading}
              className="w-[100px] from-[#f8f8f8] to-[#e6e6e6] font-[Orbitron] text-md rounded-xl cursor-pointer py-3 font-semibold transition  hover:bg-[linear-gradient(135deg,#e4e4e4,#fafafa,#dcdcdc)] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 border border-none  text-[#4a4949]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </center>

          {msg && (
            <p className="mt-4 text-center text-sm text-red-500">{msg}</p>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-gray-700 transition"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>

      <style jsx global>{`
        @keyframes metallicShimmer {
          0% {
            transform: translateX(-50%) skewX(-10deg);
          }
          100% {
            transform: translateX(50%) skewX(-10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
