"use client";
import React from "react";
import Link from "next/link";

const Navig = () => {
  return (
    <div className="fixed top-0 right-0 z-50 flex justify-end p-4 bg-[#3a256600] rounded-3xl m-2 w-fit backdrop-blur-md">
      <button
        onClick={() => (window.location.href = "/login")}
        className="px-4 py-2 text-[#e5e4e2] opacity-80 rounded-3xl transition-all duration-200 transform hover:opacity-100 hover:scale-105 font-[Orbitron] cursor-pointer mr-2 border border-transparent hover:border-[#b9b9b9]"
      >
        Sign In
      </button>

      <button
        onClick={() => (window.location.href = "/signup")}
        className="px-4 py-2 text-[#e5e4e2] opacity-80 rounded-3xl transition-all duration-200 transform hover:opacity-100 hover:scale-105 font-[Orbitron] cursor-pointer border border-transparent hover:border-[#b9b9b9]"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Navig;
