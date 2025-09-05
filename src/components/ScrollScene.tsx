"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "./Section";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Twilight → Sunset gradient (7 steps)
    const bgColors = [
      "#1e1b4b", // Deep twilight (night)
      "#322e7d", // Indigo
      "#5550a3", // Early dawn violet
      "#7d75c2", // Soft morning light
      "#b3c7e6", // Bright day
      "#ffd580", // Golden hour
      "#ff914d", // Sunset orange
    ];

    gsap.to(containerRef.current, {
      backgroundColor: gsap.utils.wrap(bgColors),
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=7000",
        scrub: true,
      },
      ease: "none",
      duration: bgColors.length - 1,
      keyframes: bgColors.map((c) => ({ backgroundColor: c })),
    });

    // Section image animations
    const sections = gsap.utils.toArray(".panel");
    sections.forEach((section: any) => {
      const img = section.querySelector("img");
      if (!img) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1000",
          pin: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        img,
        { y: 100, x: -100, scale: 0.8, opacity: 0 },
        { y: 0, x: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
      ).to(
        img,
        {
          y: -50,
          x: 100,
          scale: 1.1,
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        },
        "+=0.5"
      );
    });
  }, []);

  const years = [
    {
      image: "/illustrations/i1.svg",
      heading: "1st Year – New Beginnings",
      id: "year1",
      features: ["Orientation", "Clubs & Societies", "Basic Courses"],
    },
    {
      image: "/illustrations/i2.svg",
      heading: "2nd Year – Exploration",
      id: "year2",
      features: ["Core Subjects", "Hackathons", "Mini Projects"],
    },
    {
      image: "/illustrations/i3.svg",
      heading: "3rd Year – Internships ",
      id: "year3",
      features: ["Internships", "Industry Projects", "Career Prep"],
    },
    {
      image: "/illustrations/i4.svg",
      heading: "4th Year – Graduation ",
      id: "year4",
      features: ["Final Year Project", "Placements", "Farewell"],
    },
  ];

  return (
    <div
      ref={containerRef}
      className="text-zinc-50 font-[Times]"
      style={{ minHeight: "100vh", backgroundColor: "#1e1b4b" }}
    >
      {/* Constellation Title */}
      <div className="w-full flex justify-center items-center pt-20 mb-12">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 200"
          className="w-[80%] max-w-5xl"
        >
          {/* Stars */}
          <motion.circle
            cx="50"
            cy="100"
            r="6"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.circle
            cx="150"
            cy="60"
            r="6"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.circle
            cx="300"
            cy="120"
            r="6"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx="500"
            cy="80"
            r="6"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
          <motion.circle
            cx="700"
            cy="100"
            r="6"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          />

          {/* Connecting lines */}
          <motion.line
            x1="50"
            y1="100"
            x2="150"
            y2="60"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.line
            x1="150"
            y1="60"
            x2="300"
            y2="120"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.line
            x1="300"
            y1="120"
            x2="500"
            y2="80"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          />
          <motion.line
            x1="500"
            y1="80"
            x2="700"
            y2="100"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
          />

          {/* Ascent text glow */}
          <motion.text
            x="400"
            y="150"
            textAnchor="middle"
            className="font-[Georgia]"
            fontSize="80"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            ASCENT
          </motion.text>
        </motion.svg>
      </div>

      {years.map((y) => (
        <div
          className="panel h-screen flex items-center justify-center relative"
          key={y.id}
        >
          <Section
            image={y.image}
            heading={y.heading}
            id={y.id}
            features={y.features}
          />
        </div>
      ))}
    </div>
  );
}
