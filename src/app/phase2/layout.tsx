"use client";

import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { useState, useEffect } from "react";
import { Phase2Provider } from "../../context/phase2Context";

export default function Phase2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // ✅ Fetch username from localStorage on client side
    const storedName = localStorage.getItem("userName") || "User";
    setUsername(storedName);
  }, []);
  return (
    <div>
      <NavbarWrapper
        phaseNo={2}
        username={username}
        points={7777}
        triangle={true}
        tBorder={{
          light: "#E53E3E",
          dark: "#EF4444",
        }}
        tColor={{
          dark: "#06B6D4",
          light: "#14B8A6",
        }}
        tDepthColor={{
          dark: "#3B82F6",
          light: "#059669",
        }}
      />
      <Phase2Provider value={{ username: username }}>{children}</Phase2Provider>
    </div>
  );
}
