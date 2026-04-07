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
        phaseNo={3}
        username={username}
        points={userCredits}
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
