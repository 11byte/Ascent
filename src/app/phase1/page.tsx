"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import FeatureCard from "@components/FeatureCard";

export default function Phase1Home() {
  const features = [
    {
      title: "Timeline Creation",
      desc: "Plan and visualize your growth.",
      link: "/phase1/timeline",
      color: "from-pink-100 to-pink-200",
    },
    {
      title: "Behavioral Tracker",
      desc: "Track habits and monitor progress.",
      link: "/phase1/tracker",
      color: "from-blue-100 to-blue-200",
    },
    {
      title: "Blog Posts",
      desc: "Read and share experiences.",
      link: "/phase1/blog",
      color: "from-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6e4] to-[#e0f2fe] text-gray-900 flex flex-col items-center py-12 px-4">
      <motion.h1
        className="text-4xl font-bold mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Phase 1 – Active 🚀
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <Link href={f.link}>
              <FeatureCard title={f.title} desc={f.desc} color={f.color} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
