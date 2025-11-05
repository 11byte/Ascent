"use client";
import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";
import { useState, useEffect } from "react";

export default function Phase3Layout({
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
        phaseNo={3}
        username={username}
        points={7777}
        triangle={true}
        tBorder={{
          light: "#3338A0",
          dark: "#3338A0",
        }}
        tColor={{
          dark: "#FCC61D",
          light: "#FCC61D",
        }}
        tDepthColor={{
          dark: "#F7F7F7",
          light: "#F7F7F7",
        }}
      />
      <Phase2Provider value={{ username: username }}>{children}</Phase2Provider>
    </div>
  );
}
