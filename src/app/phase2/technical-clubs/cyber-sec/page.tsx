"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Terminal,
  Rocket,
  Calendar,
  ArrowLeft,
  Code,
} from "lucide-react";
import Link from "next/link";
import UpcomingEvents from "../../../../components/clubs/UpcomingEvents";

const club = {
  name: "Cyber Security Club",

  tagline: "Guardians of the Digital Realm.",

  description:
    "Aegis Security is the college cyber security division focused on penetration testing, threat intelligence, digital forensics and Capture The Flag competitions. The club trains students to identify vulnerabilities, secure infrastructure and build defensive cyber systems.",

  stats: {
    members: "90+",
    projects: "18+",
    workshops: "30+",
  },

  activities: [
    "Weekly Penetration Testing Workshops",
    "Monthly Threat Intelligence Briefings",
    "Capture The Flag (CTF) Training",
    "Web Application Vulnerability Testing",
  ],

  coreMembers: [
    {
      name: "Rohit Kumar",
      role: "Security Lead",
      domain: "Penetration Testing",
    },
    {
      name: "Anita Desai",
      role: "Incident Response Coordinator",
      domain: "Cyber Defense",
    },
    {
      name: "Vikram Shah",
      role: "Forensics Analyst",
      domain: "Network Forensics",
    },
  ],

  projects: [
    {
      title: "Network Intrusion Detection System",
      description:
        "Machine learning based IDS designed to detect anomalous traffic patterns and potential network attacks.",
    },
    {
      title: "Web Vulnerability Scanner",
      description:
        "Automated security scanner capable of detecting SQL injection, XSS and common OWASP vulnerabilities.",
    },
    {
      title: "Malware Behavior Analyzer",
      description:
        "Sandbox environment to study suspicious executables and classify malware behavior patterns.",
    },
  ],
};

export default function CyberSecClubPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 lg:px-20 py-20">
      {/* BACK BUTTON */}

      <Link
        href="/phase2/technical-clubs"
        className="flex items-center text-gray-400 hover:text-white mb-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Clubs
      </Link>

      {/* HERO */}

      <section className="relative max-w-6xl mx-auto mb-20">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/20 blur-[180px] rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-red-400">{club.name}</h1>

          <p className="mt-3 text-xl text-gray-300 italic">{club.tagline}</p>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {club.description}
          </p>

          <button className="mt-8 px-8 py-3 rounded-3xl border-2 border-green-300 text-green-300 bg-transparent hover:bg-green-300 hover:text-emerald-700 font-semibold transition">
            Request to Join
          </button>
        </motion.div>
      </section>

      {/* STATS */}

      <section className="max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Stat
            icon={Users}
            value={club.stats.members}
            label="Security Members"
            color="red"
          />

          <Stat
            icon={Rocket}
            value={club.stats.projects}
            label="Security Tools Built"
            color="red"
          />

          <Stat
            icon={Calendar}
            value={club.stats.workshops}
            label="Security Workshops"
            color="red"
          />
        </div>
      </section>

      {/* CORE TEAM */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-red-400">Core Team</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {club.coreMembers.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-xl font-bold text-red-400 mb-4">
                {member.name.charAt(0)}
              </div>

              <h3 className="font-semibold text-lg">{member.name}</h3>

              <p className="text-red-400 text-sm mt-1">{member.role}</p>

              <p className="text-gray-400 text-sm mt-2">{member.domain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-red-400">
          Security Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {club.activities.map((activity, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 6 }}
              className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <Code className="w-4 h-4 text-red-400 mt-1" />

              <p className="text-gray-300 text-sm">{activity}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS */}

      <UpcomingEvents color="red" />

      {/* PROJECTS */}

      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-8 text-red-400">
          Security Projects
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {club.projects.map((project, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg">{project.title}</h3>

              <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4"
    >
      <div className="p-3 bg-red-500/10 rounded-lg">
        <Icon className="w-6 h-6 text-red-400" />
      </div>

      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
