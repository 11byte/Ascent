"use client";

import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";
import { useState, useEffect } from "react";

export default function Phase2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState<string>("");
  const [userCredits, setUserCredits] = useState<number>(0);

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User";
    const userId = localStorage.getItem("userId");

    setUsername(storedName);

    if (!userId) return;

    const loadUserCredits = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/profile/${userId}`);
        const data = await response.json();

        if (response.ok && data?.status && typeof data?.user?.roadmap_credits === "number") {
          setUserCredits(data.user.roadmap_credits);
        }
      } catch (error) {
        console.error("Failed to load user credits:", error);
      }
    };

    loadUserCredits();
  }, []);
  return (
    <div>
      <NavbarWrapper
        phaseNo={1}
        username={username}
        points={userCredits}
        triangle={true}
        tBorder={{
          light: "#77BEF0",
          dark: "#77BEF0",
        }}
        tColor={{
          dark: "#FFCB61",
          light: "#FFCB61",
        }}
        tDepthColor={{
          dark: "#EA5B6F",
          light: "#EA5B6F",
        }}
      />
      <Phase2Provider value={{ username }}>{children}</Phase2Provider>
    </div>
  );
}
