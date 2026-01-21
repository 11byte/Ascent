"use client";

import React, { useEffect, useState } from "react";
import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";
import Phase4NavbarClient from "../../components/navbar/Phase4Navbar.client";

export default function Phase4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // ✅ Fetch username from localStorage on client side
    console.log("Fetching username from localStorage", localStorage.getItem("userName"));
    const storedName = localStorage.getItem("userName") || "User";
    setUsername(storedName);
    console.log("Username set to:", storedName);
  }, []);

  return (
    <div>
      <Phase4NavbarClient username={username} points={7777} />
      <Phase2Provider value={{ username }}>{children}</Phase2Provider>
    </div>
  );
}
