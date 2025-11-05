"use client";

import { usePathname } from "next/navigation";
import NavbarWrapper from "./Navbar-Wrapper";

const DEFAULT_CONFIG = {
  showNavItems: false,
  showCredits: false,
  userCredits: 0,
};

// Route-specific overrides within /phase4
const OVERRIDES: Record<string, Partial<typeof DEFAULT_CONFIG>> = {
  "/phase4/roadmap-generator": {
    showNavItems: true,
    showCredits: true,
    userCredits: 1567,
  },
};

function getConfigForPath(pathname: string) {
  // Find the first key in OVERRIDES that matches as a prefix
  const match = Object.keys(OVERRIDES).find((key) =>
    pathname.startsWith(key)
  );

  return {
    ...DEFAULT_CONFIG,
    ...(match ? OVERRIDES[match] : {}),
  };
}

export default function Phase4NavbarClient() {
  const pathname = (usePathname() || "").replace(/\/$/, ""); // normalize trailing slash

  const config = getConfigForPath(pathname);

  return (
    <NavbarWrapper
      // Your theme for Phase 4
      phaseNo={4}
      username="User"
      points={7777}
      triangle
      tBorder={{ light: "#F3F3E0", dark: "#F3F3E0" }}
      tColor={{ dark: "#183B4E", light: "#183B4E" }}
      tDepthColor={{ dark: "#DDA853", light: "#DDA853" }}
      // Route-driven props
      showNavItems={config.showNavItems}
      showCredits={config.showCredits}
      userCredits={config.userCredits}
    />
  );
}
