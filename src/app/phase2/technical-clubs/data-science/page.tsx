"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Users,
  Rocket,
  Calendar,
  ArrowLeft,
  Code,
} from "lucide-react";
import Link from "next/link";
import UpcomingEvents from "../../../../components/clubs/UpcomingEvents";

const club = {
  name: "Data Science Club",

  tagline: "Transforming Data into Insight.",

  description:
    "Nexus Data Core focuses on statistical modeling, big data analytics, and advanced visualization. The club trains students to analyze complex datasets, build predictive models, and communicate insights effectively using Python, R, and modern data platforms.",

  stats: {
    members: "110+",
    projects: "22+",
    workshops: "35+",
  },

  activities: [
    "Weekly Data Analysis Workshops (Pandas / NumPy)",
    "Visualization Challenges (Power BI / Tableau)",
    "Predictive Modeling Hackathons",
    "A/B Testing & Experiment Design",
  ],

  coreMembers: [
    {
      name: "Sanjay Patel",
      role: "Data Science Lead",
      domain: "Statistical Modeling",
    },
    {
      name: "Megha Joshi",
      role: "Visualization Expert",
      domain: "Data Visualization",
    },
    {
      name: "Vishal Rao",
      role: "ML Engineer",
      domain: "Predictive Modeling",
    },
  ],

  projects: [
    {
      title: "Customer Churn Predictor",
      description:
        "Predictive analytics model that identifies customers likely to churn using logistic regression and ensemble techniques.",
    },
    {
      title: "Interactive Data Dashboard",
      description:
        "Real-time analytics dashboard built using Python and Power BI for visualizing large datasets.",
    },
    {
      title: "Sales Forecasting Engine",
      description:
        "Time-series forecasting system that predicts sales trends using ARIMA and machine learning models.",
    },
  ],
};

export default function DataScienceClubPage() {
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
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime-500/20 blur-[180px] rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-lime-500/10 rounded-xl border border-lime-500/30">
              <BarChart className="w-10 h-10 text-lime-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-lime-400">{club.name}</h1>

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
            label="Data Scientists"
          />

          <Stat
            icon={Rocket}
            value={club.stats.projects}
            label="Analytics Projects"
          />

          <Stat
            icon={Calendar}
            value={club.stats.workshops}
            label="Workshops Hosted"
          />
        </div>
      </section>

      {/* CORE TEAM */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-lime-400">Core Team</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {club.coreMembers.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-lime-500/20 flex items-center justify-center text-xl font-bold text-lime-400 mb-4">
                {member.name.charAt(0)}
              </div>

              <h3 className="font-semibold text-lg">{member.name}</h3>

              <p className="text-lime-400 text-sm mt-1">{member.role}</p>

              <p className="text-gray-400 text-sm mt-2">{member.domain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}

      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-lime-400">
          Data Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {club.activities.map((activity, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 6 }}
              className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <Code className="w-4 h-4 text-lime-400 mt-1" />

              <p className="text-gray-300 text-sm">{activity}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EVENTS */}

      <UpcomingEvents color="green" />

      {/* PROJECTS */}

      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-8 text-lime-400">
          Data Science Projects
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
      <div className="p-3 bg-lime-500/10 rounded-lg">
        <Icon className="w-6 h-6 text-lime-400" />
      </div>

      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
