"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phase: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Signup failed");

      setMsg("✅ Account created! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectYear = (value: string) => {
    setForm({ ...form, phase: value });
    setOpenDropdown(false);
  };

  const options = [
    { label: "FE", value: "1" },
    { label: "SE", value: "2" },
    { label: "TE", value: "3" },
    { label: "BE", value: "4" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#eef5f8] via-[#dce8ec] to-[#cfdde2] relative overflow-hidden">
      {/* Metallic shimmer effect */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.65)_15%,transparent_50%,rgba(255,255,255,0.65)_85%)] opacity-40 animate-[metallicShimmer_6s_linear_infinite]" />

      {/* Home button */}
      <motion.button
        onClick={() => (window.location.href = "http://localhost:3000")}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="absolute left-[15px] top-[15px] flex items-center justify-center text-2xl font-[Orbitron] font-extrabold text-white cursor-pointer disabled:opacity-60 overflow-hidden"
        animate={{
          width: isHovered ? 120 : 60,
          height: isHovered ? 45 : 60,
          clipPath: isHovered
            ? "inset(0% round 50px)"
            : "polygon(50% 0%, 80% 10%, 95% 35%, 95% 65%, 80% 90%, 50% 100%, 20% 90%, 5% 65%, 5% 35%, 20% 10%)",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        style={{
          background: "black",
          boxShadow: "0 0 0 2px rgba(0,0,0,1)",
        }}
      >
        <p
          className="m-0 absolute z-20 leading-none"
          style={{
            fontSize: isHovered ? "100%" : "130%",
            marginBottom: isHovered ? "0px" : "5px",
          }}
        >
          {isHovered ? "Home" : "⌂"}
        </p>
      </motion.button>

      {/* Signup Form */}
      <div className="w-full max-w-md px-6 relative z-10">
        <form
          onSubmit={handleSignup}
          className="bg-gradient-to-br from-[#f3f7fa] to-[#e2edf1] backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-6 border border-[#c9d8dd]"
        >
          {/* Title */}
          <div className="text-zinc-700 font-[Orbitron] text-4xl w-full mb-[40px]">
            <center>
              <h3 className="my-1.5">Ascent</h3>
            </center>
          </div>

          {/* Name */}
          <label className="block text-sm text-gray-700 mb-2">Name</label>
          <input
            name="name"
            type="text"
            className="w-full rounded-xl px-4 py-3 mb-5 bg-white/80 border border-gray-300 outline-none focus:ring-2 focus:ring-[#a8d5e6] focus:border-[#a8d5e6] transition text-zinc-700 shadow-inner"
            placeholder="Jane Platinum"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-xl px-4 py-3 mb-5 bg-white/80 border border-gray-300 outline-none focus:ring-2 focus:ring-[#9fc7da] focus:border-[#9fc7da] transition text-zinc-700 shadow-inner"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-xl px-4 py-3 mb-6 bg-white/80 border border-gray-300 outline-none focus:ring-2 focus:ring-[#88bdd2] focus:border-[#88bdd2] transition text-zinc-700 shadow-inner"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* College Year */}
          <label className="block text-sm text-gray-700 mb-2">
            College Year
          </label>
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full rounded-xl px-4 py-3 bg-white/80 border border-gray-300 text-left text-zinc-700 focus:ring-2 focus:ring-[#88bdd2] transition shadow-inner"
            >
              {form.phase
                ? options.find((opt) => opt.value === form.phase)?.label
                : "Select Year"}
            </button>

            <AnimatePresence>
              {openDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20"
                >
                  {options.map((opt) => (
                    <motion.li
                      key={opt.value}
                      whileHover={{ backgroundColor: "#eaf3f6", scale: 1.02 }}
                      className="px-4 py-2 text-gray-700 cursor-pointer transition-colors"
                      onClick={() => handleSelectYear(opt.value)}
                    >
                      {opt.label}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <center>
            <button
              type="submit"
              disabled={loading}
              className="w-[140px] from-[#f3f7fa] to-[#e2edf1] font-[Orbitron] text-md rounded-xl cursor-pointer py-3 font-semibold transition hover:bg-[linear-gradient(135deg,#eaf3f6,#f5fafc,#d9e6ec)] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 border-none text-[#3f5057]"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </center>

          {/* Message */}
          {msg && (
            <p className="mt-4 text-center text-sm text-red-500">{msg}</p>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-gray-700 transition"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Shimmer Animation */}
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

export default Signup;
