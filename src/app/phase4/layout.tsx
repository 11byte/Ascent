"use client";

import React, { useEffect, useState } from "react";
import { Phase2Provider } from "../../context/phase2Context";
import Phase4NavbarClient from "../../components/navbar/Phase4Navbar.client";

export default function Phase4Layout({
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
    <div className="relative min-h-screen pt-[70px] isolate">
      <Phase4NavbarClient username={username} points={userCredits} />
      <Phase2Provider value={{ username }}>{children}</Phase2Provider>
    </div>
  );
}
