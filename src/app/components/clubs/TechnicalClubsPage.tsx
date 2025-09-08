"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card, CardContent } from "src/app/components/ui/card";
import { Button } from "src/app/components/ui/button";
import { Shield, Brain, BarChart, Cloud, Code, Cpu } from "lucide-react";
import { useState } from "react";

const clubs = [
  {
    name: "Cybersecurity Club",
    icon: <Shield className="w-10 h-10 text-red-400" />,
    desc: "Ethical hacking, CTFs, and cyber defense strategies.",
    domain: "cyber",
  },
  {
    name: "AI/ML Club",
    icon: <Brain className="w-10 h-10 text-red-400" />,
    desc: "AI, ML, and Deep Learning projects & hackathons.",
    domain: "ai",
  },
  {
    name: "Data Science & Structures Club",
    icon: <BarChart className="w-10 h-10 text-red-400" />,
    desc: "Data analysis, algorithms, and coding contests.",
    domain: "data",
  },
  {
    name: "Cloud & DevOps Club",
    icon: <Cloud className="w-10 h-10 text-red-400" />,
    desc: "Cloud computing, Docker, Kubernetes, CI/CD pipelines.",
    domain: "cloud",
  },
  {
    name: "Web & App Development Club",
    icon: <Code className="w-10 h-10 text-red-400" />,
    desc: "Build websites, apps, and showcase projects.",
    domain: "web",
  },
  {
    name: "Robotics & IoT Club",
    icon: <Cpu className="w-10 h-10 text-red-400" />,
    desc: "Robotics, IoT devices, and hardware projects.",
    domain: "robotics",
  },
];

export default function TechnicalClubsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-6 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/bg-tech.jpg')", // 👈 put your image in public/bg-tech.jpg
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header */}
        <motion.h1
          className="text-5xl font-extrabold text-center text-white px-6 py-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Your Technical Tribe 🚀
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-200 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Choose your domain, join a club, and grow with peers.
        </motion.p>

        {/* Domain Selector */}
        <div className="flex gap-4 mt-8 flex-wrap justify-center">
          {["ai", "cyber", "data", "cloud", "web", "robotics"].map((domain) => (
            <Button
              key={domain}
              className={`rounded-xl px-5 py-2 transition-all ${
                selectedDomain === domain
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              {domain.toUpperCase()}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setSelectedDomain(null)}
            className="rounded-xl text-white border-white hover:bg-white hover:text-black"
          >
            Show All
          </Button>
        </div>

        {/* Clubs Grid */}
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {clubs
            .filter((club) => !selectedDomain || club.domain === selectedDomain)
            .map((club, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Tilt glareEnable={true} glareMaxOpacity={0.2} scale={1.05}>
                  <Card className="rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 hover:shadow-2xl transition overflow-hidden">
                    <CardContent className="p-6 flex flex-col items-center text-center text-white">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {club.icon}
                      </motion.div>
                      <h2 className="mt-4 text-xl font-semibold">
                        {club.name}
                      </h2>
                      <p className="mt-2 text-gray-200 text-sm">{club.desc}</p>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2">
                          Join Now
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </Tilt>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
