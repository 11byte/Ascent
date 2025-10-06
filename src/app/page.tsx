"use client";
import ScrollScene from "../components/ScrollScene";
import Landing from "../components/Landing";
import Navbar from "../components/Navig";
import NavbarWrapper from "../components/navbar/Navbar-Wrapper";

export default function Home() {
  return (
    <main>
      <Navbar />
      <button
        onClick={() => (window.location.href = "/phase1")}
        className="px-4 py-2 bg-[#070033] absolute bottom-2 right-5 text-white rounded-3xl hover:bg-[#32286170] backdrop-blur-3xl transition border border-[wheat] hover:border-[#b9b9b9] mr-2 cursor-pointer z-200"
      >
        PHASE-1
      </button>
      <button
        onClick={() => (window.location.href = "/phase2")}
        className="px-4 py-2 bg-[#070033] absolute bottom-2 right-60 text-white rounded-3xl hover:bg-[#32286170] backdrop-blur-3xl transition border border-[wheat] hover:border-[#b9b9b9] mr-2 cursor-pointer z-200"
      >
        PHASE-2
      </button>
      <button
        onClick={() => (window.location.href = "/phase3")}
        className="px-4 py-2 bg-[#070033] absolute bottom-2 right-115 text-white rounded-3xl hover:bg-[#32286170] backdrop-blur-3xl transition border border-[wheat] hover:border-[#b9b9b9] mr-2 cursor-pointer z-200"
      >
        PHASE-3
      </button>
      <button
        onClick={() => (window.location.href = "/phase4")}
        className="px-4 py-2 bg-[#070033] absolute bottom-2 right-170 text-white rounded-3xl hover:bg-[#32286170] backdrop-blur-3xl transition border border-[wheat] hover:border-[#b9b9b9] mr-2 cursor-pointer z-200"
      >
        PHASE-4
      </button>
      <Landing />
      {/* <ScrollScene /> */}
    </main>
  );
}
