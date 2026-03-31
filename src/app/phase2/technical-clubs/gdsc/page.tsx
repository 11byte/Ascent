"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Users,
  Rocket,
  Calendar,
  ArrowLeft,
  Code,
} from "lucide-react";
import Link from "next/link";
import UpcomingEvents from "../../../../components/clubs/UpcomingEvents";

const club = {
  name: "GDSC Campus Chapter",

  tagline: "Empowering Developers, Building Community.",

  description:
    "The Google Developer Student Club (GDSC) empowers students to learn, build, and grow with Google technologies. Members collaborate on real-world projects, participate in global developer programs, and build innovative solutions using tools like Firebase, Google Cloud, Flutter, and Android.",

  stats: {
    members: "150+",
    projects: "30+",
    workshops: "45+",
  },

  activities: [
    "Google Cloud & Firebase Workshops",
    "Android & Flutter Development Sessions",
    "Hackathons and Coding Challenges",
    "Tech Talks & Developer Community Meetups",
  ],

  coreMembers: [
    {
      name: "Aarav Khanna",
      role: "GDSC Lead",
      domain: "Community & Outreach",
    },
    {
      name: "Meera Singh",
      role: "Tech Lead",
      domain: "Cloud & Mobile Development",
    },
    {
      name: "Kunal Roy",
      role: "Event Coordinator",
      domain: "Workshops & Hackathons",
    },
  ],

  projects: [
    {
      title: "Campus Event App",
      description:
        "A Flutter-based application that allows students to explore and register for campus technical events.",
    },
    {
      title: "Firebase Chat Platform",
      description:
        "Real-time messaging platform built using Firebase authentication and Firestore.",
    },
    {
      title: "Smart Attendance System",
      description:
        "A QR-code based attendance system integrated with Google Sheets for automated record keeping.",
    },
  ],
};

export default function GDSCClubPage() {
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
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/20 blur-[180px] rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/30">
              <Monitor className="w-10 h-10 text-teal-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-teal-400">{club.name}</h1>

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
            label="Community Members"
            color="teal"
          />

          <Stat
            icon={Rocket}
            value={club.stats.projects}
            label="Developer Projects"
            color="teal"
          />

          <Stat
            icon={Calendar}
            value={club.stats.workshops}
            label="Developer Events"
            color="teal"
          />
        </div>
      </section>

      {/* CORE TEAM */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-teal-400">Core Team</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {club.coreMembers.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center text-xl font-bold text-teal-400 mb-4">
                {member.name.charAt(0)}
              </div>

              <h3 className="font-semibold text-lg">{member.name}</h3>

              <p className="text-teal-400 text-sm mt-1">{member.role}</p>

              <p className="text-gray-400 text-sm mt-2">{member.domain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-teal-400">
          Community Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {club.activities.map((activity, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 6 }}
              className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <Code className="w-4 h-4 text-teal-400 mt-1" />

              <p className="text-gray-300 text-sm">{activity}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS */}

      <UpcomingEvents color="green" />

      {/* PROJECTS */}

      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-8 text-teal-400">
          Community Projects
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
      <div className="p-3 bg-teal-500/10 rounded-lg">
        <Icon className="w-6 h-6 text-teal-400" />
      </div>

      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
