"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FogLiftSection } from "../../components/animations/FogLiftSection";
import { AppLauncher } from "../../components/home/AppLauncher";
import { WidgetSystem } from "../../components/widgets/WidgetSystem";
import { usePhase2 } from "../../context/phase2Context";
import Lenis from "@studio-freight/lenis";

// ✅ NEW IMPORT
import BackgroundTimeline from "../../components/BackgroundTimeline";

export default function Home() {
  const { username } = usePhase2();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greetIndex, setGreetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetIndex((prev) => (prev + 1) % greetings.length);
    }, 2000); // change every 2 sec

    return () => clearInterval(interval);
  }, []);

  const [binaryElements, setBinaryElements] = useState<
    {
      left: string;
      top: string;
      value: string;
      delay: number;
      duration: number;
    }[]
  >([]);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const elements = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      value: Math.random() > 0.5 ? "1" : "0",
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 4,
    }));
    setBinaryElements(elements);

    return () => {
      clearInterval(timer);
      lenis.destroy();
    };
  }, []);

  const timeData = useMemo(
    () => ({
      time: currentTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }),
    [currentTime],
  );

  const greetings = [
    // Global
    "Hola",
    "Hello",
    "Bonjour",
    "Ciao",
    "Hallo",
    "Olá",

    // Indian Languages (English script)
    "Namaste", // Hindi / Sanskrit
    "Namaskaram", // Telugu / Malayalam
    "Vanakkam", // Tamil
    "Namaskara", // Kannada
    "Kem Cho", // Gujarati
    "Nomoshkar", // Bengali
    "Sat Sri Akal", // Punjabi
    "Jai Jagannath", // Odia (cultural greeting)
    "Khamma Ghani", // Rajasthani
    "Ram Ram", // Haryanvi / Hindi belt
    "Adaab", // Urdu

    // Asian (kept in English script as per your requirement)
    "Konnichiwa", // Japanese
    "Annyeonghaseyo", // Korean
    "Marhaba", // Arabic
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ✅ NEW BACKGROUND TIMELINE */}
      <div className="z-40">
        <BackgroundTimeline />
      </div>

      {/* Main Content */}
      <FogLiftSection className="min-h-screen relative z-10 pt-20 pointer-events-none">
        {/* Clock */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-28 lg:top-36 right-8 text-right font-[Georgia] pointer-events-auto"
        >
          <div className="text-4xl lg:text-6xl font-bold text-white/95 font-mono tracking-wider drop-shadow-2xl">
            {timeData.time}
          </div>
          <div className="text-lg lg:text-xl text-white/80 mt-2 drop-shadow-lg">
            {timeData.date}
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-28 lg:bottom-10 right-10"
        >
          <h1 className="  mb-2 text-6xl flex gap-3">
            <motion.span
              key={greetIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-[#f5ff64] text-accent-teal mx-1 font-[Georgia] italic"
            >
              {greetings[greetIndex]}
            </motion.span>

            <span className="font-[Orbitron] text-[#fcffce]">
              {username?.split(" ")[0]} !
            </span>
          </h1>
        </motion.div>

        {/* Binary Particles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {binaryElements.map((el, i) => (
            <motion.div
              key={`binary-${i}`}
              className="absolute text-accent-teal/30 font-mono text-xs select-none"
              style={{ left: el.left, top: el.top }}
              animate={{
                opacity: [0, 0.2, 0],
                y: [-10, 10],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut",
              }}
            >
              {el.value}
            </motion.div>
          ))}
        </motion.div>
      </FogLiftSection>

      {/* Widgets */}
      <WidgetSystem />

      {/* App Launcher */}
      <AppLauncher phase="phase4" />
    </div>
  );
}
