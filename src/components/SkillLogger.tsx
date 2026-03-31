"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Skill {
  id: number;
  phase: string;
  category: string;
  skillName: string;
  level?: string;
  proofUrl?: string;
}

export default function SkillLogger({
  onSkillAdded,
}: {
  onSkillAdded?: () => void;
}) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    phase: "1",
    category: "",
    skillName: "",
    level: "",
    proofUrl: "",
  });

  const API = "http://localhost:5000/api/skills";

  /* ================================
     Fetch Skills
  ================================= */

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(`${API}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.ok) setSkills(data.skills);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  /* ================================
     Handle Inputs
  ================================= */

  const handleChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  /* ================================
     Add Skill
  ================================= */

  const addSkill = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        fetchSkills();

        // 🔥 notify parent timeline
        if (onSkillAdded) {
          onSkillAdded();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     Delete Skill
  ================================= */

  const deleteSkill = async (id: number) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchSkills();
  };

  return (
    <div className="relative max-w-2xl mx-auto p-10 text-white flex flex-col gap-10">
      {/* Background Glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 blur-3xl pointer-events-none" />

      {/* =========================
          Skill Form
      ========================= */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          flex flex-col gap-5
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-[2rem]
          p-8
          shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        "
      >
        {/* Phase */}

        <Select
          value={form.phase}
          onValueChange={(value: string) => handleChange("phase", value)}
        >
          <SelectTrigger className="bg-black/40 border-white/20 rounded-[2rem]">
            <SelectValue placeholder="Select Phase" />
          </SelectTrigger>

          <SelectContent className="bg-[#11002f] text-white border border-rose-500 rounded-xl">
            <SelectItem value="1">Phase I - FE</SelectItem>
            <SelectItem value="2">Phase II - SE</SelectItem>
            <SelectItem value="3">Phase III - TE</SelectItem>
            <SelectItem value="4">Phase IV - BE</SelectItem>
          </SelectContent>
        </Select>

        {/* Category */}

        <Input
          placeholder="Category (Technical Skills, Hackathons)"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="bg-black/40 border-white/20 rounded-[2rem]"
        />

        {/* Skill */}

        <Input
          placeholder="Skill / Achievement"
          value={form.skillName}
          onChange={(e) => handleChange("skillName", e.target.value)}
          className="bg-black/40 border-white/20 rounded-[2rem]"
        />

        {/* Level */}

        <Select
          value={form.level}
          onValueChange={(value: string) => handleChange("level", value)}
        >
          <SelectTrigger className="bg-black/40 border-white/20 rounded-[2rem]">
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>

          <SelectContent className="bg-[#11002f] text-white rounded-xl">
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {/* Proof */}

        <Input
          placeholder="Proof URL (GitHub / Certificate)"
          value={form.proofUrl}
          onChange={(e) => handleChange("proofUrl", e.target.value)}
          className="bg-black/40 border-white/20 rounded-[2rem]"
        />

        {/* Add Skill Button */}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2"
        >
          <center>
            <Button
              onClick={addSkill}
              className="
              relative
              cursor-pointer
              rounded-[2rem]
              px-8 py-3
              bg-white/5
              backdrop-blur-xl
              border border-rose-500/50
              text-rose-500
              font-semibold
              shadow-[0_0_25px_rgba(244,63,94,0.25)]
              hover:shadow-[0_0_40px_rgba(244,63,94,0.45)]
              transition-all
              overflow-hidden
            "
            >
              <span className="relative z-10">Add Skill</span>

              {/* shimmer animation */}

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
              />
            </Button>
          </center>
        </motion.div>
      </motion.div>

      {/* =========================
          Skill List
      ========================= */}
    </div>
  );
}
