"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Challenge = {
  id: number;
  title: string;
  start?: string;
  expiry: string;
};

type Theme = {
  name: string;
  accent: string;
  border: string;
  soft: string;
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

export default function PSCalendarModal({
  challenges,
  theme,
}: {
  challenges: Challenge[];
  theme: Theme;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(new Date());

  const today = new Date();

  /* ------------------ COLOR MAP ------------------ */

  const colorMap = useMemo(() => {
    const map: Record<number, string> = {};
    challenges.forEach((c, i) => {
      map[c.id] = COLORS[i % COLORS.length];
    });
    return map;
  }, [challenges]);

  /* ------------------ CALENDAR DAYS ------------------ */

  const days = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();

    const total = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: total }, (_, i) => {
      return new Date(year, month, i + 1);
    });
  }, [current]);

  /* ------------------ NAVIGATION ------------------ */

  const prevMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  /* ------------------ HELPERS ------------------ */

  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  const isInRange = (d: Date, c: Challenge) => {
    const start = c.start ? new Date(c.start) : new Date(c.expiry);
    const end = new Date(c.expiry);
    return d >= start && d <= end;
  };

  const laneMap = useMemo(() => {
    const map: Record<number, number> = {};
    challenges.forEach((c, i) => {
      map[c.id] = i; // stable lane index
    });
    return map;
  }, [challenges]);

  /* ------------------ UI ------------------ */

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 z-50">
        {/* BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="p-4 rounded-full bg-white text-black shadow-lg hover:scale-105 transition"
        >
          <Calendar size={20} />
        </button>

        {/* LABEL */}
        <span className="text-xs text-gray-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
          PS Calendar
        </span>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f0f10] p-6 rounded-xl w-[90%] max-w-4xl border border-white/10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth}>←</button>

                <div className="text-lg font-medium">
                  {current.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <button onClick={nextMonth}>→</button>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((d, i) => {
                  const active = challenges.filter((c) => isInRange(d, c));

                  return (
                    <div
                      key={i}
                      className={`h-20 p-2 rounded relative group ${
                        isToday(d)
                          ? "border border-white"
                          : "border border-white/5"
                      }`}
                    >
                      {/* DATE */}
                      <div className="text-xs text-gray-400">{d.getDate()}</div>

                      {/* POLYLINES */}
                      <div className="mt-3 relative">
                        {active.map((c) => {
                          const color = colorMap[c.id];
                          const lane = laneMap[c.id];

                          return (
                            <div
                              key={c.id}
                              className="absolute left-0 right-0 flex items-center"
                              style={{
                                top: `${lane * 6}px`, // ✅ fixed lane spacing
                              }}
                            >
                              {/* NODE */}
                              <div
                                className="w-[4px] h-[4px] rounded-full z-10"
                                style={{ background: color }}
                              />

                              {/* LINE */}
                              <div
                                className="flex-1 h-[2px]"
                                style={{
                                  background: color,
                                  opacity: 0.85,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* TOOLTIP */}
                      {active.length > 0 && (
                        <div className="absolute hidden group-hover:block top-full left-0 mt-2 bg-black border border-white/10 p-3 rounded text-xs z-50 w-52">
                          {active.map((c) => (
                            <div key={c.id} className="mb-2">
                              <div>{c.title}</div>
                              <div className="text-gray-500">
                                {c.start} → {c.expiry}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CLOSE */}
              <div className="mt-6 text-right">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-400"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
