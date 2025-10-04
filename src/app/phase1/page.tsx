// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import FeatureCard from "@components/FeatureCard";

// export default function Phase1Home() {
//   const features = [
//     {
//       title: "Timeline Creation",
//       desc: "Plan and visualize your growth.",
//       link: "/phase1/timeline",
//       color: "from-pink-100 to-pink-200",
//     },
//     {
//       title: "Behavioral Tracker",
//       desc: "Track habits and monitor progress.",
//       link: "/phase1/tracker",
//       color: "from-blue-100 to-blue-200",
//     },
//     {
//       title: "Blog Posts",
//       desc: "Read and share experiences.",
//       link: "/phase1/blog",
//       color: "from-purple-100 to-purple-200",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#fef6e4] to-[#e0f2fe] text-gray-900 flex flex-col items-center py-12 px-4">
//       <motion.h1
//         className="text-4xl font-bold mb-10"
//         initial={{ opacity: 0, y: -40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         Phase 1 – Active 🚀
//       </motion.h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
//         {features.map((f, i) => (
//           <motion.div
//             key={f.title}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: i * 0.2 }}
//           >
//             <Link href={f.link}>
//               <FeatureCard title={f.title} desc={f.desc} color={f.color} />
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FogLiftSection } from "@components/animations/FogLiftSection";
import { AppLauncher } from "@components/home/AppLauncher";
import { HomeBackground } from "@components/home/HomeBackground";
import { WidgetSystem } from "@components/widgets/WidgetSystem";
import { usePhase2 } from "@context/phase2Context";
import Lenis from "@studio-freight/lenis";

export default function Home() {
  const { username } = usePhase2();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔹 Generate binary elements only on client
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
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08, // Adjust scroll smoothness
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clock updater
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Random binary elements
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
      lenis.destroy(); // Clean up
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
    [currentTime]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <HomeBackground username="Paresh" />

      {/* Main Content */}
      <FogLiftSection className="min-h-screen relative z-10 pt-20">
        {/* Top Right - Clock */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-28 lg:top-36 right-8 text-right"
        >
          <div className="text-4xl lg:text-6xl font-bold text-white/95 font-mono tracking-wider drop-shadow-2xl">
            {timeData.time}
          </div>
          <div className="text-lg lg:text-xl text-white/80 mt-2 drop-shadow-lg">
            {timeData.date}
          </div>
        </motion.div>

        {/* Compact Greeting - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-28 lg:bottom-10 right-10"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            <span className="text-accent-teal">Hola</span> {username}!
          </h1>
        </motion.div>

        {/* Subtle Binary Background Elements */}
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

      {/* Widget System */}
      <WidgetSystem />

      {/* App Launcher */}
      <AppLauncher />
    </div>
  );
}
