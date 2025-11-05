"use client";

import React, { useEffect, useState } from "react";
import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";

export default function Phase4Layout({
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
        phaseNo={4}
        username={username}
        points={7777}
        triangle={true}
        tBorder={{
          light: "#F3F3E0",
          dark: "#F3F3E0",
        }}
        tColor={{
          dark: "#183B4E",
          light: "#183B4E",
        }}
        tDepthColor={{
          dark: "#DDA853",
          light: "#DDA853",
        }}
      />

      {/* ✅ Pass username dynamically into provider */}
      <Phase2Provider value={{ username }}>{children}</Phase2Provider>
    </div>
  );
}
