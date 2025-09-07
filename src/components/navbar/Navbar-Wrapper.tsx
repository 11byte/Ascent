"use client";
import { useEffect } from "react";
import Navbar from "./Navbar";
import AOS from "aos";

const NavbarWrapper = (
  {
  phaseNo=2,
  username="Paresh",
  points=1000,
  triangle=true,
  tBorder={
    light:"#E53E3E", 
    dark:"#EF4444"
  },
  tColor={
    dark:"#06B6D4",
    light: "#14B8A6"
  },
  tDepthColor={
    dark:"#3B82F6",
    light:"#059669"
  }
}) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <Navbar
      username={username}
      points={points}
      phaseNo={phaseNo}
      tBorder={tBorder}
      triangle={triangle}
      tColor={tColor}
      tDepthColor={tDepthColor}
    />
  );
};

export default NavbarWrapper;
