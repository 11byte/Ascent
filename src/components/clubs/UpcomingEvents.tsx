"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { upcomingEvents } from "@/data/clubs/events";

interface UpcomingEventsProps {
  color?: "fuchsia" | "red" | "blue" | "green";
}

const colorThemes = {
  fuchsia: {
    title: "text-fuchsia-400",
    badgeBg: "bg-fuchsia-500/20",
    badgeText: "text-fuchsia-400",
    button: "bg-fuchsia-500 hover:bg-fuchsia-600",
  },
  red: {
    title: "text-red-400",
    badgeBg: "bg-red-500/20",
    badgeText: "text-red-400",
    button: "bg-red-500 hover:bg-red-600",
  },
  blue: {
    title: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    badgeText: "text-blue-400",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  green: {
    title: "text-green-400",
    badgeBg: "bg-green-500/20",
    badgeText: "text-green-400",
    button: "bg-green-500 hover:bg-green-600",
  },
};

export default function UpcomingEvents({
  color = "fuchsia",
}: UpcomingEventsProps) {
  const theme = colorThemes[color];

  return (
    <section className="max-w-6xl mx-auto mt-20">
      <h2 className={`text-3xl font-bold mb-8 ${theme.title}`}>
        Upcoming Events
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {upcomingEvents.map((event, i) => {
          const date = new Date(event.date);

          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });

          return (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between"
            >
              {/* DATE BADGE */}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`${theme.badgeBg} ${theme.badgeText} px-3 py-2 rounded-lg text-center`}
                  >
                    <p className="text-lg font-bold">{day}</p>
                    <p className="text-xs">{month}</p>
                  </div>

                  <p className="text-xs text-green-400 font-medium">
                    {event.status}
                  </p>
                </div>
              </div>

              {/* TITLE */}

              <h3 className="text-lg font-semibold">{event.title}</h3>

              {/* DESCRIPTION */}

              <p className="text-gray-400 text-sm mt-3">{event.description}</p>

              {/* META */}

              <div className="flex items-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </div>

              {/* ACTION */}

              <button
                className={`mt-6 text-white py-2 rounded-lg text-sm font-semibold transition ${theme.button}`}
              >
                View Details
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
