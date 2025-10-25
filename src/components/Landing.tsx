"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PerformanceMonitor } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<SVGSVGElement>(null);
  const [perfLow, setPerfLow] = useState(false);

  const infoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ⚡ Impact frame control
  const [showImpact, setShowImpact] = useState(false);

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
  const parentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!infoRef.current) return;

    gsap.to(infoRef.current, {
      maxWidth: "98%",
      ease: "power1.out",
      paddingInline: "6%",
      scrollTrigger: {
        trigger: infoRef.current,
        start: "top 95%", // when top of div is 80% from top of viewport
        end: "top 65%", // end when top reaches middle
        scrub: 1.5, // smooth progress with scroll
      },
    });
    if (!parentRef.current) return;

    gsap.to(parentRef.current, {
      maxWidth: "98%",
      ease: "power1.out",
      paddingInline: "6%",
      scrollTrigger: {
        trigger: parentRef.current,
        start: "top 95%", // when top of div is 80% from top of viewport
        end: "top 65%", // end when top reaches middle
        scrub: 1.5, // smooth progress with scroll
      },
    });

    if (!containerRef.current || !nebulaRef.current || !titleRef.current)
      return;

    // ⚡ Impact frame animation
    const timer = setTimeout(() => {
      setShowImpact(true);
      gsap.to(".impact-frame", {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.05,
        onComplete: () => setShowImpact(false),
      });
    }, 1800);

    // Nebula parallax
    gsap.to(nebulaRef.current, {
      scale: 1.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Title animation
    requestAnimationFrame(() => {
      const stars = titleRef.current?.querySelectorAll(".star");
      const lines = titleRef.current?.querySelectorAll(".line");
      if (!stars || !lines) return;

      const tl = gsap.timeline();
      tl.fromTo(
        stars,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          stagger: 0.15,
          ease: "back.out(2)",
        }
      );

      lines.forEach((line, i) => {
        const path = line as SVGPathElement;
        const length = path.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(
          line,
          { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut" },
          `>-0.1`
        );
      });
    });

    // ScrollTrigger for phase updates
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top top",
        end: "+=" + 800 * panels.length,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * panels.length);
          setActiveIndex((prev) =>
            prev !== index
              ? index < panels.length
                ? index
                : panels.length - 1
              : prev
          );
        },
      },
    });

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((s) => s.kill());
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* ---- Your Original Page ---- */}
      <div
        ref={containerRef}
        className="text-zinc-50 font-[Times] relative"
        style={{ minHeight: "600vh", overflowX: "hidden" }}
      >
        {/* Nebula BG */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div ref={nebulaRef} className="nebula" />
          <div className="cosmic-stars" />
        </div>

        {/* Title */}
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

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 20, y: 20 }}
          whileInView={{ opacity: 1, y: 50 }} // Animate when in view
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          ref={infoRef}
          style={{
            position: "relative",
            zIndex: 10,
            background: `
    linear-gradient(
      135deg,
      #050005 0%,       
      #1a0a2a 30%,      
      #4b1cbf 50%,      
      #1a0a2a 70%,
      #050005 100%    
    )
  `,
          }}
          className="justify-center border-rose-500 border-y-2 shadow-[0_-20px_280px_0_rgba(244,63,94,0.5)] mx-auto  rounded-4xl max-w-[75%] transition-all"
        >
          <div className="relative w-[95%] h-[100vh] flex py-15 px-0 ">
            <motion.h3
              style={{
                fontFamily: "Orbitron",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              className=" text-rose-500 text-5xl m-0"
            >
              Why ASCENT ???
            </motion.h3>
          </div>
        </motion.div>

        {/* Phases */}
        <div
          ref={parentRef}
          style={{
            zIndex: 30,
            position: "relative",
            background: `
    linear-gradient(
      135deg,
      #050005 0%,       /* almost black base */
      #1a0a2a 30%,      /* deep purple shadow */
      #4b1cbf 50%,      /* brighter purple shine in the middle */
      #1a0a2a 70%,      /* deep purple again */
      #050005 100%      /* almost black edge */
    )
  `,
          }}
          className="justify-center border-rose-500 border-y-2 shadow-[0_-20px_280px_0_rgba(244,63,94,0.5)] mx-auto  rounded-4xl max-w-[75%] transition-all"
        >
          <div
            ref={cardsRef}
            className="relative w-[95%] h-[100vh] flex items-center justify-center "
          >
            {/* LEFT: 3D Cosmic Cards */}
            <div className="relative w-[100%] h-[80vh] flex items-center justify-center">
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 2, 8.5], fov: 55 }}
              >
                <Environment preset="sunset" />
                <PerformanceMonitor onDecline={() => setPerfLow(true)} />
                <ambientLight intensity={1.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <PlanetOrbitScene activeIndex={activeIndex} />
              </Canvas>
            </div>

            <div className="w-[60%] h-[70vh] flex flex-col justify-center pl-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={panels[activeIndex]?.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  {/* Phase Title */}
                  <h3
                    className="text-5xl font-[Orbitron] drop-shadow-lg"
                    style={{ color: panels[activeIndex].color }}
                  >
                    {panels[activeIndex].phaseLabel}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-gray-200 leading-relaxed max-w-md">
                    {panels[activeIndex].desc}
                  </p>

                  {/* Feature Tiles */}
                  <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                    {panels[activeIndex].items.map((it, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{
                          scale: 1.05,
                          rotateX: 8,
                          rotateY: -8,
                          boxShadow: `0px 0px 20px ${panels[activeIndex].color}55`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                        className="relative bg-[transparent]
                       border border-zinc-700/50 rounded-2xl p-4 text-center 
                       text-gray-100 cursor-pointer overflow-hidden group"
                      >
                        {/* Glow Edge Border on Hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            boxShadow: `0 0 15px ${panels[activeIndex].color}`,
                            border: `1px solid ${panels[activeIndex].color}`,
                            borderRadius: "1rem",
                          }}
                        ></div>

                        <h4
                          className="relative z-10 text-lg font-semibold tracking-wide"
                          style={{
                            color: panels[activeIndex].color,
                            textShadow: `0 0 10px ${panels[activeIndex].color}55`,
                          }}
                        >
                          {it}
                        </h4>

                        {/* Subtle shimmer animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur-md animate-shimmer"></div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- Styles --- */}
        <style jsx>{`
          .star {
            will-change: opacity, transform, filter;
          }
          .line {
            will-change: stroke-dashoffset, opacity;
          }

          .nebula {
            position: absolute;
            inset: 0;
            background: 
  /* Subtle violet shimmer */ radial-gradient(
                circle at 25% 35%,
                rgba(90, 0, 180, 0.18),
                transparent 60%
              ),
              /* Cyan metallic glint */
                radial-gradient(
                  circle at 70% 65%,
                  rgba(0, 180, 255, 0.15),
                  transparent 70%
                ),
              /* Deep crimson undertone */
                radial-gradient(
                  circle at 50% 80%,
                  rgba(150, 20, 40, 0.12),
                  transparent 75%
                ),
              /* Soft metallic sheen (angled gloss) */
                linear-gradient(
                  125deg,
                  rgba(255, 255, 255, 0.06) 0%,
                  rgba(255, 255, 255, 0.02) 25%,
                  rgba(0, 0, 0, 0.6) 50%,
                  rgba(255, 255, 255, 0.03) 75%,
                  rgba(0, 0, 0, 0.8) 100%
                ),
              /* Brushed metal texture hint */
                repeating-linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.015) 0px,
                  rgba(255, 255, 255, 0.02) 2px,
                  rgba(0, 0, 0, 0.02) 4px,
                  rgba(0, 0, 0, 0.015) 6px
                ),
              /* Base metallic black gradient */
                linear-gradient(180deg, #0b0b0d 0%, #0a0a0a 40%, #000000 100%);

            background-blend-mode: screen, overlay, overlay, soft-light, normal,
              normal;
            background-color: #000;

            filter: blur(40px) brightness(1.1);
            opacity: 0.9;
          }

          .cosmic-stars {
            position: absolute;
            inset: 0;
            background: transparent
              url("https://www.transparenttextures.com/patterns/stardust.png");
            opacity: 0.15;
            mix-blend-mode: screen;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    </>
  );
}

/* --- 3D PLANET SCENE COMPONENTS --- */
function PlanetOrbitScene({ activeIndex }: { activeIndex: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const orbitRadius = 4;

  const planets = [
    { size: 0.8, model: "/model.glb" },
    { size: 0.9, model: "/phase2.glb" },
    { size: 1.0, model: "/phase3.glb" },
    { size: 1.1, model: "/phase4.glb" },
  ];

  const totalPlanets = planets.length;
  const angleStep = (2 * Math.PI) / totalPlanets;
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = -activeIndex * angleStep;
  }, [activeIndex]);

  useFrame(() => {
    // Smooth orbit rotation
    currentRotation.current +=
      (targetRotation.current - currentRotation.current) * 0.05;
    if (groupRef.current) groupRef.current.rotation.y = currentRotation.current;

    // Move the light to face the active planet
    if (lightRef.current) {
      const angle = activeIndex * angleStep + currentRotation.current;
      lightRef.current.position.set(
        Math.sin(angle) * orbitRadius * 1.5,
        2,
        Math.cos(angle) * orbitRadius * 1.5
      );
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      {/* ✨ Directional light that follows the active planet */}
      <directionalLight
        ref={lightRef}
        intensity={3}
        color={"#ffffff"}
        position={[5, 2, 5]}
      />
      <ambientLight intensity={0.2} />

      <group ref={groupRef}>
        {/* Orbit Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
          <meshBasicMaterial
            color="#00ffff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Planets */}
        {planets.map((planet, i) => {
          const angle = i * angleStep;
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;
          const isActive = i === activeIndex;

          return (
            <PlanetModel
              key={i}
              position={[x, 0, z]}
              active={isActive}
              scale={planet.size}
              modelPath={planet.model}
              angle={angle} // pass angle
              currentRotation={currentRotation} // pass currentRotation
            />
          );
        })}
      </group>
    </>
  );
}

function PlanetModel({
  position,
  active,
  scale = 1,
  modelPath,
  angle,
  currentRotation,
}: {
  position: [number, number, number];
  active: boolean;
  scale?: number;
  modelPath: string;
  angle: number;
  currentRotation: React.MutableRefObject<number>;
}) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (meshRef.current) {
      // Rotate slowly for some effect
      meshRef.current.rotation.y += 0.005;

      // Fade based on Z position relative to camera
      const totalAngle = angle + currentRotation.current;
      const z = Math.cos(totalAngle); // z = 1 → front, z = -1 → back
      const opacity = THREE.MathUtils.mapLinear(z, -1, 1, 0.3, 1);

      // Update opacity of all child meshes
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          material.transparent = true;
          material.opacity = active ? 1 : opacity; // active model fully visible
        }
      });
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={position}
      scale={[scale, scale, scale]}
    />
  );
}

function Planet({
  index,
  angle,
  currentRotation,
  angleStep,
  position,
  color,
  size,
  active,
  texture,
}: {
  index: number;
  angle: number;
  currentRotation: React.MutableRefObject<number>;
  angleStep: number;
  position: [number, number, number];
  color: string;
  size: number;
  active: boolean;
  texture: string;
}) {
  const planetTexture = useLoader(THREE.TextureLoader, texture);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      // Calculate the current angle of the planet
      const totalAngle = angle + currentRotation.current;
      // Fade when behind (z < 0)
      const z = Math.cos(totalAngle);
      const opacity = THREE.MathUtils.mapLinear(z, -1, 1, 0.3, 1);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = opacity;
      material.transparent = true;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        map={planetTexture}
        color={color}
        emissive={active ? color : "#000000"}
        emissiveIntensity={active ? 1.2 : 0.1}
        metalness={0.3}
        roughness={0.7}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = Array.from({ length: 500 }, () => [
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30,
  ]).flat();

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(positions), 3]}
        />
      </bufferGeometry>

      <pointsMaterial color="white" size={0.03} />
    </points>
  );
}
