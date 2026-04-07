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
        phaseNo={2}
        username={username}
        points={userCredits}
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
