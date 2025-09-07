"use client";
import React from "react";
import Link from "next/link";

const Navig = () => {
  return (
    <div className="fixed top-0 right-0 z-50 flex justify-end p-4 bg-[#3a25668f] rounded-3xl m-2 w-fit backdrop-blur-md">
      <button
        onClick={() => (window.location.href = "/login")}
        className="px-4 py-2 bg-[#020033] text-white rounded-3xl hover:bg-[#2a286170] transition border border-[wheat] hover:border-[#b9b9b9] mr-2"
      >
        Sign In
      </button>

      <button
        onClick={() => (window.location.href = "/signup")}
        className="px-4 py-2 bg-[#330025] text-white rounded-3xl hover:bg-[#66465e] transition border border-[#f5deb3] hover:border-[#b9b9b9]"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Navig;
