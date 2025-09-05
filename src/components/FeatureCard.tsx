"use client";
import { motion } from "framer-motion";

type Props = {
  title: string;
  desc: string;
  color: string;
};

export default function FeatureCard({ title, desc, color }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.97 }}
      className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} cursor-pointer transition`}
    >
      <motion.h2
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {desc}
      </motion.p>
    </motion.div>
  );
}
