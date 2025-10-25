// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ascent - Phase 2: The Fog Lifts",
  description: "Welcome to Phase 2 of our journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
