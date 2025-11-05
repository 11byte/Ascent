"use client";
import { useEffect, useRef, useState } from "react";

// Manual type declarations for particles.js
declare global {
  interface Window {
    particlesJS: (tagId: string, config: any) => void;
    pJSDom: Array<{
      pJS: {
        fn: {
          vendors: {
            destroyCanvas: () => void;
          };
        };
        particles: {
          array: any[];
        };
      };
    }>;
  }
}

// Optimized particles.js configuration for Phase 2 - Dark Theme
const particlesConfig = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1200,
      },
    },
    color: {
      value: ["#FFFFFF"],
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
    },
    opacity: {
      value: 0.6,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.2,
        sync: false,
      },
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.5,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 140,
      color: "#FFFFFF",
      opacity: 0.3,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 600,
      },
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 160,
        line_linked: {
          opacity: 0.8,
        },
      },
      bubble: {
        distance: 250,
        size: 25,
        duration: 1,
        opacity: 0.9,
        speed: 2,
      },
      repulse: {
        distance: 120,
        duration: 0.4,
      },
      push: {
        particles_nb: 3,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

export const HomeBackground = ({
  username = "Paresh-0007",
  background = "#000000",
}) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const loadParticlesJS = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if particles.js is already loaded
        if (typeof window.particlesJS === "function") {
          resolve();
          return;
        }

        // Create script element
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
        script.async = true;

        script.onload = () => {
          console.log("✅ Particles.js loaded from CDN");
          resolve();
        };

        script.onerror = () => {
          console.error("❌ Failed to load particles.js from CDN");
          reject(new Error("Failed to load particles.js"));
        };

        document.head.appendChild(script);
      });
    };

    const initializeParticles = async () => {
      try {
        await loadParticlesJS();

        if (particlesRef.current && window.particlesJS) {
          // Initialize particles
          window.particlesJS("particles-background", particlesConfig);
          setIsLoaded(true);
          setLoadError(false);

          console.log(`✅ Particles.js initialized for ${username}`);

          // Setup cleanup function
          cleanup = () => {
            if (window.pJSDom && window.pJSDom[0]) {
              try {
                window.pJSDom[0].pJS.fn.vendors.destroyCanvas();
                window.pJSDom = [];
                console.log("✅ Particles.js cleaned up");
              } catch (error) {
                console.warn("Particles cleanup warning:", error);
              }
            }
          };
        }
      } catch (error) {
        console.error("❌ Failed to initialize particles.js:", error);
        setLoadError(true);
        setIsLoaded(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initializeParticles, 100);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, []);

  // Fallback darkest black background
  if (loadError) {
    return (
      <div className="absolute inset-0 z-0">
        {/* Pure Black Base */}
        <div className="absolute inset-0 bg-black" />

        {/* Minimal accent gradients on pure black */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
            `,
          }}
        />

        {/* Animated tech elements as fallback */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`fallback-${i}`}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Pure Black Background Base */}
      <div className="absolute inset-0" style={{ background }} />

      {/* Minimal Phase 2 Accent Overlays on Pure Black */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* Particles.js Container */}
      <div
        id="particles-background"
        ref={particlesRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "transparent",
          pointerEvents: "auto",
        }}
      />

      {/* Subtle Tech Grid on Black */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Minimal Corner Accents on Black */}
      {/* <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-red/08 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent-teal/08 to-transparent rounded-full blur-3xl" /> */}

      {/* Subtle User Data Integration */}
      <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
        <div className="text-xs font-mono text-white/40">
          // Phase 2 initialized for {username}
        </div>
      </div>

      {/* Phase 2 Branding Watermark */}
      <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
        <div className="text-xs font-mono text-white/30">
          PHASE 2 • DEVELOPMENT WORKSPACE
        </div>
      </div>
    </div>
  );
};
