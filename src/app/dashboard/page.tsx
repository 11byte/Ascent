import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth(); // ✅ await the Promise

  if (!userId) {
    // user is not signed in
    return <p>Please sign in to view this page.</p>;
  }

  return <h1>Welcome user {userId}!</h1>;
}
// "use client";
// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { motion } from "framer-motion";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// gsap.registerPlugin(ScrollTrigger);

// export default function Landing() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const nebulaRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<SVGSVGElement>(null);
//   const horizontalRef = useRef<HTMLDivElement>(null);
//   const borderRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (
//       !containerRef.current ||
//       !nebulaRef.current ||
//       !titleRef.current ||
//       !horizontalRef.current ||
//       !borderRef.current
//     )
//       return;

//     // --- Nebula BG ---
//     // --- Nebula BG --- (optional parallax)
//     gsap.to(nebulaRef.current, {
//       scale: 1.2,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: true,
//       },
//     });

//     // --- Title stars + lines ---
//     const stars = titleRef.current.querySelectorAll(".star");
//     const lines = titleRef.current.querySelectorAll(".line");

//     const titleTl = gsap.timeline({
//       scrollTrigger: {
//         trigger: titleRef.current,
//         start: "top 80%",
//         toggleActions: "play none none reverse",
//       },
//     });

//     titleTl.fromTo(
//       stars,
//       { opacity: 0, scale: 0 },
//       { opacity: 1, scale: 1, duration: 0.2, stagger: 0.2, ease: "back.out(2)" }
//     );

//     lines.forEach((line) => {
//       const length = (line as SVGPathElement).getTotalLength();
//       gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
//       titleTl.to(line, {
//         strokeDashoffset: 0,
//         duration: 0.35,
//         ease: "power1.inOut",
//       });
//     });

//     // --- Horizontal Scroll Sections ---
//     const sections = gsap.utils.toArray<HTMLDivElement>(".panel");
//     const totalSections = sections.length;

//     // Horizontal scroll
//     // Horizontal scroll
//     gsap.to(sections, {
//       xPercent: -100 * (totalSections - 1),
//       ease: "none",
//       scrollTrigger: {
//         trigger: horizontalRef.current,
//         pin: true,
//         scrub: true,
//         snap: {
//           snapTo: 1 / (totalSections - 1),
//           duration: 0.8,
//           ease: "power1.inOut",
//         },
//         start: "top-=80 top",
//         end: () => "+=" + horizontalRef.current!.offsetWidth,
//         onUpdate: (self) => {
//           const progress = self.progress; // 0 → 1
//           let gradient = "";

//           if (progress < 0.25) {
//             gradient = "linear-gradient(to bottom, #ff66b2, #ff1493)";
//           } else if (progress < 0.5) {
//             gradient = "linear-gradient(to bottom, #50c878, #006400)";
//           } else if (progress < 0.75) {
//             gradient = "linear-gradient(to bottom, #ffd700, #ffae42)";
//           } else {
//             gradient = "linear-gradient(to bottom, #00cfff, #0055ff)";
//           }

//           (borderRef.current as HTMLDivElement).style.borderImage =
//             gradient + " 1";
//         },
//       },
//     });
//     // Optional parallax scale for nebula during horizontal scroll
//     ScrollTrigger.create({
//       trigger: horizontalRef.current,
//       start: "top top",
//       end: () => "+=" + horizontalRef.current!.offsetWidth,
//       scrub: true,
//       onUpdate: (self) => {
//         gsap.to(nebulaRef.current, {
//           scale: 1.1 + self.progress * 0.1, // slightly grows as you scroll
//           overwrite: "auto",
//         });
//       },
//     });
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="text-zinc-50 font-[Times] relative"
//       style={{ minHeight: "600vh", overflowX: "hidden" }}
//     >
//       {/* Nebula BG */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <div ref={nebulaRef} className="nebula"></div>
//       </div>

//       {/* Title */}
//       <div className="mb-[800px]">
//         <div className="w-full flex justify-center items-center pt-20 mb-12 relative z-10">
//           <svg
//             ref={titleRef}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 800 200"
//             className="w-[92%] max-w-7xl h-[390px]"
//           >
//             <circle className="star" cx="120" cy="210" r="6" fill="white" />
//             <circle className="star" cx="200" cy="20" r="6" fill="white" />
//             <circle className="star" cx="260" cy="160" r="6" fill="white" />
//             <circle className="star" cx="150" cy="80" r="6" fill="white" />
//             <line
//               className="line"
//               x1="120"
//               y1="210"
//               x2="200"
//               y2="20"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <line
//               className="line"
//               x1="200"
//               y1="20"
//               x2="260"
//               y2="160"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <line
//               className="line"
//               x1="260"
//               y1="160"
//               x2="150"
//               y2="80"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <line
//               className="line"
//               x1="150"
//               y1="80"
//               x2="250"
//               y2="40"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <line
//               className="line"
//               x1="280"
//               y1="180"
//               x2="600"
//               y2="180"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <motion.text
//               x="440"
//               y="170"
//               textAnchor="middle"
//               fontSize="80"
//               fontFamily="Orbitron, sans-serif"
//               initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
//               animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
//               transition={{ duration: 1.5, ease: "easeOut" }}
//               style={{
//                 fill: "url(#platinumGradient)",
//                 filter:
//                   "drop-shadow(0px 0px 8px rgba(200,200,200,0.9)) drop-shadow(0px 0px 16px rgba(255,255,255,0.6))",
//               }}
//             >
//               SCENT
//             </motion.text>

//             <defs>
//               <linearGradient
//                 id="platinumGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="100%"
//               >
//                 <stop offset="0%" stopColor="#e5e4e2" />
//                 <stop offset="40%" stopColor="#c0c0c0" />
//                 <stop offset="70%" stopColor="#f8f8f8" />
//                 <stop offset="100%" stopColor="#d6d6d6" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//         <motion.h3
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1.5, ease: "easeOut" }}
//           style={{ fontFamily: "Orbitron, sans-serif", fontStyle: "italic" }}
//           className="mt-[-100px] ml-[35%] text-3xl text-cyan-200"
//         >
//           Aligning the stars of unwavering success....
//         </motion.h3>
//       </div>

//       {/* Horizontal Scroll Container */}
//       <motion.div
//         whileInView={{ opacity: 1, x: 0 }}
//         initial={{ opacity: 0, x: -30 }}
//         transition={{ duration: 1.5, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.3 }}
//         ref={horizontalRef}
//         className="relative w-[90%] ml-[-20px] h-[90vh] overflow-hidden flex rounded-tr-[600px] rounded-br-[600px] -mt-[300px]"
//       >
//         {/* Border overlay */}
//         <div
//           ref={borderRef}
//           className="absolute inset-0 rounded-tr-[600px] rounded-br-[600px] border-[6px] pointer-events-none"
//           style={{
//             borderImage: "linear-gradient(to bottom, #ff66b2, #ff1493) 1",
//           }}
//         />

//         {/* Panels */}
//         <section className="panel min-w-full h-full flex items-center justify-center bg-[#ffffffa8] ">
//           <DotLottieReact
//             className="w-[600px]"
//             src="/jetpack.lottie"
//             loop
//             autoplay
//           />
//           <motion.div className="fixed left-20 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//             Timeline
//           </motion.div>

//           <motion.div className="p-5 absolute left-80 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center align-middle justify-center text-gray-700 text-xl font-semibold ml-10">
//             Behaviour tracking
//           </motion.div>

//           <center>
//             <motion.div className="  absolute left-140 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               2D virtual campus
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-200 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Tech NewsLetter
//             </motion.div>
//           </center>
//           <motion.div className=" absolute left-100 bottom-3 w-100 h-20 rounded-full text-5xl text-fuchsia-100 font-[Orbitron] bg-[#fff5] shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center font-semibold ml-10">
//             Phase-1
//           </motion.div>
//         </section>
//         <section className="panel min-w-full h-full flex items-center justify-center bg-[#ffffff94] ">
//           <DotLottieReact
//             className="w-[700px]"
//             src="/p2.lottie"
//             loop
//             autoplay
//           />
//           <center>
//             <motion.div className="  fixed left-20 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Technical clubs
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-80 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Bounty Board
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-140 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Macro Hackathons
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-200 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Leet Tracker
//             </motion.div>
//           </center>
//           <motion.div className=" absolute left-100 bottom-3 w-100 h-20 rounded-full text-5xl text-fuchsia-100 font-[Orbitron] bg-[#fff5] shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center font-semibold ml-10">
//             Phase-2
//           </motion.div>
//         </section>
//         <section className="panel min-w-full h-full flex items-center justify-center bg-[#ffffff75] ">
//           <DotLottieReact
//             className="w-[800px]"
//             src="/p3.lottie"
//             loop
//             autoplay
//           />
//           <center>
//             <motion.div className=" fixed left-20 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Git Tracker
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-80 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Career Roadmap
//             </motion.div>
//           </center>

//           <center>
//             <motion.div className="  absolute left-140 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               DSA leader boards
//             </motion.div>
//           </center>
//           <motion.div className=" absolute left-100 bottom-3 w-100 h-20 rounded-full text-5xl text-fuchsia-100 font-[Orbitron] bg-[#fff5] shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center font-semibold ml-10">
//             Phase-3
//           </motion.div>
//         </section>
//         <section className="panel min-w-full h-full flex items-center justify-center bg-[#ffffff52] ">
//           <DotLottieReact
//             className="w-[800px]"
//             src="/p4.lottie"
//             loop
//             autoplay
//           />
//           <center>
//             <motion.div className="fixed left-20 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//               Interview Pods
//             </motion.div>
//           </center>
//           <motion.div className=" absolute left-80 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//             Skill Tree
//           </motion.div>

//           <motion.div className=" absolute left-140 top-1 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-700 text-xl font-semibold ml-10">
//             . . .
//           </motion.div>
//           <motion.div className=" absolute left-100 bottom-3 w-100 h-20 rounded-full text-5xl text-fuchsia-100 font-[Orbitron] bg-[#fff5] shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center font-semibold ml-10">
//             Phase-4
//           </motion.div>
//         </section>
//       </motion.div>

//       {/* Styles */}
//       <style jsx>{`
//         .nebula {
//           position: absolute;
//           inset: 0;
//           background:
//       /* Dark metallic base with 60% darkness on top */ linear-gradient(
//               to bottom,
//               #000 60%,
//               transparent 100%
//             ),
//             radial-gradient(
//               circle at 30% 30%,
//               rgba(75, 0, 130, 0.5),
//               transparent 70%
//             ),
//             radial-gradient(
//               circle at 70% 60%,
//               rgba(138, 43, 226, 0.6),
//               transparent 80%
//             ),
//             radial-gradient(
//               circle at 50% 80%,
//               rgba(255, 20, 147, 0.5),
//               transparent 85%
//             );

//           background-blend-mode: overlay, screen, screen, screen;
//           filter: contrast(1.2) brightness(0.9) saturate(1.15);
//           opacity: 0.95;
//           overflow: hidden;
//         }

//         /* Metallic brushed texture */
//         .nebula::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: url("https://www.transparenttextures.com/patterns/brushed-alum.png");
//           mix-blend-mode: overlay;
//           opacity: 0.12;
//         }

//         /* Shimmer highlight that also adds gloss */
//         .nebula::before {
//           content: "";
//           position: absolute;
//           inset: -50%;
//           background: linear-gradient(
//             120deg,
//             transparent 30%,
//             rgba(255, 255, 255, 0.25) 50%,
//             transparent 70%
//           );
//           animation: shimmerMove 14s linear infinite;
//           mix-blend-mode: screen;
//           pointer-events: none;
//         }

//         @keyframes shimmerMove {
//           0% {
//             transform: translateX(-50%) translateY(-50%) rotate(0deg);
//             filter: brightness(1);
//           }
//           25% {
//             filter: brightness(1.25); /* glossy reflection peak */
//           }
//           50% {
//             filter: brightness(1);
//           }
//           75% {
//             filter: brightness(1.25);
//           }
//           100% {
//             transform: translateX(50%) translateY(50%) rotate(360deg);
//             filter: brightness(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
