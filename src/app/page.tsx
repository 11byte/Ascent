"use client";
import ScrollScene from "../components/ScrollScene";
import Landing from "../components/Landing";
import Navbar from "../components/Navig";
import NavbarWrapper from "../components/navbar/Navbar-Wrapper";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Landing />
        </div>
      </div>{" "}
      {/* <ScrollScene /> */}
    </main>
  );
}
