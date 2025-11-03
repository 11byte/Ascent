import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navig";
import ClientProgressBar from "../components/ClientProgressBar";

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
  title: "Ascent: AI SaaS for Engineering Institutes",
  description: "Welcome to Phase 2 of our journey",
  icons: {
    icon: [{ url: "/logo-ascent.png", type: "image/png", sizes: "32x32" }],
    shortcut: { url: "/logo-ascent.png" },
    apple: { url: "/logo-ascent.png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <Navbar />
        <ClientProgressBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
