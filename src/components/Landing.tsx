"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<SVGSVGElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const panels = [
    {
      id: "phase-1",
      phaseLabel: "Phase 1",
      color: "#ff66b2",
      items: [
        "Timeline",
        "Behaviour tracking",
        "2D virtual campus",
        "Tech Newsletter",
      ],
      desc: "Phase-1 introduces foundational engagement features, tracking behaviour and integrating a virtual tech ecosystem.",
    },
    {
      id: "phase-2",
      phaseLabel: "Phase 2",
      color: "#50c878",
      items: ["Technical Clubs", "Bounty Board", "MacroThons", "Leet Tracker"],
      desc: "Phase-2 expands collaboration through clubs, bounty boards and hackathons to fuel peer-to-peer learning.",
    },
    {
      id: "phase-3",
      phaseLabel: "Phase 3",
      color: "#ffd700",
      items: ["Git Tracker", "Career Roadmap", "DSA Leaderboards"],
      desc: "Phase-3 focuses on growth metrics, career planning and coding excellence with leaderboards and trackers.",
    },
    {
      id: "phase-4",
      phaseLabel: "Phase 4",
      color: "#00cfff",
      items: ["Interview Pods", "Skill Tree", "..."],
      desc: "Phase-4 unlocks advanced upskilling with interactive pods and a personalized skill tree for long-term success.",
    },
  ];

  useEffect(() => {
    if (!infoRef.current || !phasesRef.current || !horizontalRef.current)
      return;

    // small reveal animation for info panel
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    );

    // // Nebula slight parallax
    // if (nebulaRef.current && containerRef.current) {
    //   gsap.to(nebulaRef.current, {
    //     scale: 1.12,
    //     ease: "none",
    //     scrollTrigger: {
    //       trigger: containerRef.current,
    //       start: "top top",
    //       end: "bottom bottom",
    //       scrub: true,
    //     },
    //   });
    // }

    // --- Title Line Draw Animation (Sequential) ---
    requestAnimationFrame(() => {
      const stars = titleRef.current?.querySelectorAll(".star");
      const lines = Array.from(
        titleRef.current?.querySelectorAll(".line") || [],
      ) as SVGLineElement[];

      // ⭐ Stars first
      if (stars) {
        gsap.fromTo(
          stars,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            stagger: 0.15,
            ease: "back.out(2)",
          },
        );
      }

      // ⭐ Convert <line> x1/y1/x2/y2 into length manually
      const lineLengths = lines.map((line) => {
        const x1 = Number(line.getAttribute("x1"));
        const y1 = Number(line.getAttribute("y1"));
        const x2 = Number(line.getAttribute("x2"));
        const y2 = Number(line.getAttribute("y2"));
        return Math.hypot(x2 - x1, y2 - y1);
      });

      // ⭐ Prep dashoffset
      lines.forEach((line, i) => {
        gsap.set(line, {
          strokeDasharray: lineLengths[i],
          strokeDashoffset: lineLengths[i],
        });
      });

      // ⭐ Sequential timeline
      const lineTL = gsap.timeline({ delay: 0.3 });

      lines.forEach((line, i) => {
        lineTL.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          ">-0.1", // small overlap for smooth chain
        );
      });
    });

    // Horizontal pinned scroll
    const panelCount = panels.length;
    const horizontalEl = horizontalRef.current;
    const phasesEl = phasesRef.current;

    // Ensure width of horizontal container equals viewport * panels
    const setWidths = () => {
      const vw = window.innerWidth;
      if (horizontalEl) {
        horizontalEl.style.width = `${panelCount * vw}px`;
      }
      // set each phase slide width
      const slides = horizontalEl?.querySelectorAll(".phase-slide");
      slides?.forEach((s: Element) => {
        (s as HTMLElement).style.width = `${vw}px`;
      });
    };

    setWidths();
    window.addEventListener("resize", setWidths);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: phasesEl,
        start: "top top",
        end: () =>
          `+=${
            window.innerWidth * 0.3 * (panelCount - 1) + window.innerHeight
          }`,
        scrub: 0.9,
        pin: true,
        snap: 1 / (panelCount - 1),
        anticipatePin: 1,
        onUpdate(self) {
          const progress = self.progress; // 0 -> 1 across full pinned area
          const index = Math.min(
            panelCount - 1,
            Math.floor((progress * panelCount) / 1),
          );
          setActiveIndex(index);
        },
      },
    });

    tl.to(horizontalEl, {
      x: () => `-${(panelCount - 1) * window.innerWidth}px`,
      ease: "none",
    });

    // kill handlers on unmount
    return () => {
      window.removeEventListener("resize", setWidths);
      ScrollTrigger.getAll().forEach((s) => s.kill());
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="text-zinc-50 font-[Times] relative"
        style={{ minHeight: "400vh", overflowX: "hidden" }}
      >
        {/* Nebula BG */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div ref={nebulaRef} className="nebula" />
          <div className="cosmic-stars" />
        </div>

        {/* Title / Hero: KEPT AS-IS (only minor container changes to remain responsive) */}
        <div className="mb-[500px]">
          <div className="w-full flex justify-center items-center pt-20 mb-12 relative z-10">
            <svg
              ref={titleRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 200"
              className="w-[92%] max-w-7xl h-[390px]"
            >
              <circle
                className="star"
                cx="120"
                cy="210"
                r="6"
                style={{
                  fill: "rgb(244 63 94)",
                  filter: "drop-shadow(0 0 6px rgba(244,63,94,0.9))",
                }}
              />
              <circle
                className="star"
                cx="200"
                cy="20"
                r="6"
                style={{
                  fill: "rgb(244 63 94)",
                  filter: "drop-shadow(0 0 6px rgba(244,63,94,0.9))",
                }}
              />
              <circle
                className="star"
                cx="260"
                cy="160"
                r="6"
                style={{
                  fill: "rgb(244 63 94)",
                  filter: "drop-shadow(0 0 6px rgba(244,63,94,0.9))",
                }}
              />
              <circle
                className="star"
                cx="150"
                cy="80"
                r="6"
                style={{
                  fill: "rgb(244 63 94)",
                  filter: "drop-shadow(0 0 6px rgba(244,63,94,0.9))",
                }}
              />
              <line
                className="line"
                x1="120"
                y1="210"
                x2="200"
                y2="20"
                stroke="white"
                strokeWidth="2"
              />
              <line
                className="line"
                x1="200"
                y1="20"
                x2="260"
                y2="160"
                stroke="white"
                strokeWidth="2"
              />
              <line
                className="line"
                x1="260"
                y1="160"
                x2="150"
                y2="80"
                stroke="white"
                strokeWidth="2"
              />
              <line
                className="line"
                x1="150"
                y1="80"
                x2="250"
                y2="40"
                stroke="white"
                strokeWidth="2"
              />
              <line
                className="line"
                x1="280"
                y1="180"
                x2="600"
                y2="180"
                stroke="white"
                strokeWidth="2"
              />
              <motion.text
                x="440"
                y="170"
                textAnchor="middle"
                fontSize="80"
                fontFamily="Orbitron, sans-serif"
                initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  fill: "url(#platinumGradient)",
                  filter:
                    "drop-shadow(0px 0px 8px rgba(200,200,200,0.9)) drop-shadow(0px 0px 16px rgba(255,255,255,0.6))",
                }}
              >
                SCENT
              </motion.text>
              <defs>
                <linearGradient
                  id="platinumGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e5e4e2" />
                  <stop offset="40%" stopColor="#c0c0c0" />
                  <stop offset="70%" stopColor="#f8f8f8" />
                  <stop offset="100%" stopColor="#d6d6d6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ fontFamily: "Orbitron, sans-serif", fontStyle: "italic" }}
            className="mt-[-100px] ml-[35%] text-3xl text-[#d6cfff]"
          >
            <span>
              AI-driven <span className="text-rose-500 text-5xl">SaaS</span> for
              engineering institutes
            </span>
          </motion.h3>
        </div>

        {/* Info Section (kept similar) */}
        <div className="relative w-full flex justify-end pl-12 mb-9">
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, rotateY: -20, rotateX: 0, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              rotateY: -25,
              rotateX: 6,
              rotateZ: 4,
              scale: 1,
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              zIndex: 10,
              background: "transparent",
              perspective: "1600px",
              transformStyle: "preserve-3d",
            }}
            className="border-rose-500 border-y-2 
               shadow-[0_-20px_280px_0_rgba(244,63,94,0.5)] 
               rounded-3xl 
               w-[65%]   /* smaller width */
               transition-all"
          >
            <div
              className="relative w-full min-h-[55vh] mx-auto 
                  flex flex-col justify-center items-center py-20"
            >
              {/* Video Section */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative w-[95%] max-w-6xl rounded-3xl 
                 overflow-hidden shadow-[0_40px_120px_rgba(244,63,94,0.4)]"
              >
                <video
                  src="/Student_Lifecycle.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[70vh] object-cover [filter:contrast(1.1)_brightness(1.05)_saturate(1.1)_sharpness(1.2)]"
                />

                {/* Red Cinematic Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr 
                      from-red-900/80 
                      via-red-600/50 
                      to-red-400/30 
                      mix-blend-multiply"
                />
              </motion.div>

              {/* Diagonal Text */}
              <motion.h3
                initial={{ opacity: 0, x: -60, rotate: 0 }}
                whileInView={{ opacity: 1, x: 0, rotate: -1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.9 }}
                style={{
                  fontFamily: "Orbitron",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
                className="absolute z-30 mt-12 text-6xl text-rose-600 mx-auto  rounded-xl left-[-650px] top-0"
              >
                Explore
                <br />
                <span className="text-[#e5daff] text-9xl">
                  The
                  <br /> Student <br />
                  Lifecycle
                </span>
                <br />
                <br />
                like never before...
              </motion.h3>
            </div>
          </motion.div>
        </div>

        {/* Phases Section (Pinned horizontal carousel) */}
        <section
          ref={phasesRef}
          className="relative z-30 mt-40 border-rose-500 border-y-2 shadow-[0_-20px_280px_0_rgba(244,63,94,0.5)] mx-auto  rounded-4xl"
          style={{
            position: "relative",
            background: "transparent",
            paddingTop: "3rem",
            paddingBottom: "3rem",
          }}
        >
          <div className="max-w-[90%] mx-auto">
            <h3
              style={{
                fontFamily: "Orbitron",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              className=" text-rose-500 text-5xl m-0 mb-8"
            >
              Phases Of Software
            </h3>

            {/* Top small nav/indicator */}
            <div className="flex items-center gap-4 mb-6">
              {panels.map((p, i) => (
                <button
                  key={p.id}
                  aria-label={`Jump to ${p.phaseLabel}`}
                  onClick={() => {
                    const rect = phasesRef.current?.getBoundingClientRect();
                    if (rect) {
                      window.scrollTo({
                        top: window.scrollY + rect.top,
                        behavior: "smooth",
                      });

                      const vw = window.innerWidth;
                      gsap.to(horizontalRef.current, {
                        x: `-${i * vw}px`,
                        duration: 0.7,
                        ease: "power2.out",
                        onStart: () => setActiveIndex(i),
                      });
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-all duration-300`}
                  style={{
                    color: activeIndex === i ? "#f43f5e" : "white",
                    borderColor: activeIndex === i ? "#f43f5e" : "white",
                    boxShadow:
                      activeIndex === i
                        ? "0 0 12px rgba(244,63,94,0.8)"
                        : "0 0 0 transparent",
                  }}
                >
                  {p.phaseLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal track (slides) */}
          <div
            style={{
              overflow: "hidden",
              width: "100%",
              height: "70vh",
            }}
          >
            <div
              ref={horizontalRef}
              className="horizontal-track"
              style={{ display: "flex", willChange: "transform" }}
            >
              {panels.map((panel, idx) => (
                <section
                  key={panel.id}
                  className="phase-slide flex-shrink-0 flex items-center justify-center"
                  style={{
                    padding: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="max-w-5xl w-full grid grid-cols-2 gap-10 items-center"
                    style={{ alignItems: "center" }}
                  >
                    {/* LEFT VISUAL — Cosmic Neon Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: activeIndex === idx ? 1 : 0.45,
                        scale: activeIndex === idx ? 1 : 0.97,
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`p-6 rounded-2xl backdrop-blur-md border transition-all
        ${
          activeIndex === idx
            ? "border-rose-500 shadow-[0_0_35px_#f43f5e88]"
            : "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        }
      `}
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1))",
                      }}
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: activeIndex === idx ? 0 : 8,
                          opacity: activeIndex === idx ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="h-[320px] w-full flex flex-col items-center justify-center rounded-xl relative overflow-hidden"
                        style={{
                          background:
                            "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05), transparent 20%)",
                        }}
                      >
                        {/* Neon Flicker Aura */}
                        {activeIndex === idx && (
                          <motion.div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            initial={{ opacity: 0.2 }}
                            animate={{
                              opacity: [0.2, 0.5, 0.3, 0.45, 0.2],
                            }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              repeatType: "mirror",
                            }}
                            style={{
                              boxShadow:
                                "0 0 55px #f43f5e77, inset 0 0 20px #f43f5e55",
                            }}
                          />
                        )}

                        {/* Icon Bubble */}
                        <motion.div
                          whileHover={{ scale: 1.06, rotateZ: -3 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                          }}
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: "30px",
                            display: "grid",
                            placeItems: "center",
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))",
                            boxShadow:
                              activeIndex === idx
                                ? "0 0 30px #f43f5e99, inset 0 -5px 20px rgba(0,0,0,0.6)"
                                : "0 0 18px rgba(255,255,255,0.15)",
                          }}
                        >
                          <svg width="68" height="68" viewBox="0 0 24 24">
                            <motion.path
                              d="M12 2L15 8H9L12 2Z M6 9H18L12 22L6 9Z"
                              fill={activeIndex === idx ? "#f43f5e" : "white"}
                              animate={{
                                scale: activeIndex === idx ? [1, 1.08, 1] : 1,
                              }}
                              transition={{
                                duration: 1.6,
                                repeat: activeIndex === idx ? Infinity : 0,
                                repeatDelay: 1.2,
                              }}
                            />
                          </svg>
                        </motion.div>

                        {/* Title & Description */}
                        <div className="text-center mt-4 px-2">
                          <h4
                            className="text-2xl font-[Orbitron] font-semibold transition-all"
                            style={{
                              color: activeIndex === idx ? "#f43f5e" : "white",
                              textShadow:
                                activeIndex === idx
                                  ? "0 0 15px #f43f5eaa"
                                  : "0 0 4px rgba(255,255,255,0.25)",
                            }}
                          >
                            {panel.phaseLabel}
                          </h4>
                          <p className="text-sm text-gray-300 max-w-xs mt-2">
                            {panel.desc}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* RIGHT SIDE — Features */}
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={panel.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{
                            opacity: activeIndex === idx ? 1 : 0.4,
                            x: activeIndex === idx ? 0 : -6,
                          }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{
                            duration: 0.55,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="space-y-6"
                        >
                          <h3
                            className="text-4xl font-[Orbitron] drop-shadow-lg transition-all"
                            style={{
                              color: activeIndex === idx ? "#f43f5e" : "white",
                              textShadow:
                                activeIndex === idx
                                  ? "0 0 12px #f43f5eaa"
                                  : "0 0 3px rgba(255,255,255,0.4)",
                            }}
                          >
                            {panel.phaseLabel}
                          </h3>

                          <p className="text-lg text-gray-200 leading-relaxed max-w-md">
                            {panel.desc}
                          </p>

                          <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                            {panel.items.map((it, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                  opacity: activeIndex === idx ? 1 : 0.5,
                                  scale: activeIndex === idx ? 1 : 0.95,
                                }}
                                whileHover={
                                  activeIndex === idx
                                    ? {
                                        scale: 1.07,
                                        rotateZ: -2,
                                        y: -8,
                                        boxShadow: "0px 10px 35px #f43f5e55",
                                      }
                                    : {}
                                }
                                transition={{
                                  type: "spring",
                                  stiffness: 240,
                                  damping: 18,
                                }}
                                className="relative bg-[transparent] border border-zinc-700/40 rounded-2xl p-4 text-center text-gray-100 cursor-default overflow-hidden group"
                              >
                                {/* Neon border on hover */}
                                <motion.div
                                  className="absolute inset-0 pointer-events-none rounded-2xl"
                                  animate={{
                                    opacity:
                                      activeIndex === idx ? [0.1, 0.4, 0.2] : 0,
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: activeIndex === idx ? Infinity : 0,
                                  }}
                                  style={{
                                    boxShadow:
                                      activeIndex === idx
                                        ? "0 0 25px #f43f5e55"
                                        : "none",
                                    border:
                                      activeIndex === idx
                                        ? "1px solid #f43f5e55"
                                        : "1px solid rgba(255,255,255,0.1)",
                                  }}
                                />

                                <h4
                                  className="relative z-10 text-lg font-semibold tracking-wide transition-all"
                                  style={{
                                    color:
                                      activeIndex === idx ? "#f43f5e" : "white",
                                    textShadow:
                                      activeIndex === idx
                                        ? "0 0 12px #f43f5e88"
                                        : "0 0 4px rgba(255,255,255,0.25)",
                                  }}
                                >
                                  {it}
                                </h4>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* --- Styles (nebula, stars, shimmer) --- */}
        <style>{`
          .nebula {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(
                circle at 25% 35%,
                rgba(90, 0, 180, 0.18),
                transparent 60%
              ),
              radial-gradient(
                circle at 70% 65%,
                rgba(0, 180, 255, 0.15),
                transparent 70%
              ),
              radial-gradient(
                circle at 50% 80%,
                rgba(150, 20, 40, 0.12),
                transparent 75%
              ),
              linear-gradient(
                125deg,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.02) 25%,
                rgba(0, 0, 0, 0.6) 50%,
                rgba(255, 255, 255, 0.03) 75%,
                rgba(0, 0, 0, 0.8) 100%
              ),
              repeating-linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.015) 0px,
                rgba(255, 255, 255, 0.02) 2px,
                rgba(0, 0, 0, 0.02) 4px,
                rgba(0, 0, 0, 0.015) 6px
              ),
              linear-gradient(180deg, #0b0b0d 0%, #0a0a2a 40%, #000000 100%);
            background-blend-mode:
              screen, overlay, overlay, soft-light, normal, normal;
            background-color: #000;
            filter: blur(40px) brightness(1.08);
            opacity: 0.95;
            will-change: transform;
          }

          .cosmic-stars {
            position: absolute;
            inset: 0;
            background: transparent
              url("https://www.transparenttextures.com/patterns/stardust.png");
            opacity: 0.13;
            mix-blend-mode: screen;
            pointer-events: none;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          /* small responsiveness */
          @media (max-width: 900px) {
            .phase-slide {
              padding: 1rem !important;
            }
            .max-w-4xl {
              gap: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
