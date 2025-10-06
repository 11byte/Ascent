// src/app/phase2/technical-clubs/components/ClubCard.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Link from 'next/link'; // 🏆 NEW: Import Next.js Link
import React, { ReactNode } from "react";
// Assuming Card, CardContent, and Button are imported correctly from parent directories
import { Card, CardContent } from "../ui/card"; // Adjusted to use the alias
import { Button } from "../ui/button"; 
import { Sparkles } from "lucide-react";

// --- Define Club Theme Colors (Safe & Static Lookups) ---
// Note: We use static Tailwind classes strings here for Tailwind to compile them.
const clubThemeColors: Record<string, { borderColor: string, shadowColor: string, gradientEnd: string, buttonBg: string, iconBorder: string }> = {
    // We are simplifying buttonBg here, assuming the default Button CVA handles the logic
    fuchsia: { 
        borderColor: 'border-fuchsia-500/60', shadowColor: 'shadow-fuchsia-500/20', gradientEnd: 'to-fuchsia-300',
        buttonBg: 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-lg', iconBorder: 'border-fuchsia-500/50'
    },
    cyan: { 
        borderColor: 'border-cyan-500/60', shadowColor: 'shadow-cyan-500/20', gradientEnd: 'to-cyan-300',
        buttonBg: 'bg-cyan-600 hover:bg-cyan-700 shadow-lg', iconBorder: 'border-cyan-500/50'
    },
    red: { 
        borderColor: 'border-red-500/60', shadowColor: 'shadow-red-500/20', gradientEnd: 'to-red-300',
        buttonBg: 'bg-red-600 hover:bg-red-700 shadow-lg', iconBorder: 'border-red-500/50'
    },
    lime: { 
        borderColor: 'border-lime-500/60', shadowColor: 'shadow-lime-500/20', gradientEnd: 'to-lime-300',
        buttonBg: 'bg-lime-600 hover:bg-lime-700 shadow-lg', iconBorder: 'border-lime-500/50'
    },
    blue: { 
        borderColor: 'border-blue-500/60', shadowColor: 'shadow-blue-500/20', gradientEnd: 'to-blue-300',
        buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-lg', iconBorder: 'border-blue-500/50'
    },
};

// --- Framer Motion Variant for Card Entrance/Exit (Using explicit type for clarity) ---
export const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        transition: { type: "spring", stiffness: 100, damping: 10 } 
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

interface Club {
    name: string;
    icon: ReactNode;
    desc: string;
    domain: string; // The SLUG identifier
    isRecommended?: boolean;
    color: keyof typeof clubThemeColors;
}

interface ClubCardProps {
    club: Club;
    index: number;
}

export default function ClubCard({ club, index }: ClubCardProps) {
    const theme = clubThemeColors[club.color] || clubThemeColors.fuchsia;
    
    // Dynamic Tailwind classes lookup
    const cardBorderClass = `border-2 ${theme.borderColor}`;
    const cardHoverShadowClass = `hover:shadow-2xl ${theme.shadowColor}`; // Using shadowColor from map
    const titleGradientClass = `bg-gradient-to-r from-white ${theme.gradientEnd}`;
    const iconBorderClass = theme.iconBorder;

    return (
        <motion.div
            key={club.name}
            variants={cardVariants}
            layout 
            exit="exit"
            className="w-full"
        >
            <Tilt 
                glareEnable={true} 
                glareMaxOpacity={0.4} 
                glareColor="#ffffff"
                scale={1.03} 
                perspective={1000}
            >
                <Card className={`relative rounded-3xl bg-gray-900/70 backdrop-blur-xl ${cardBorderClass} transition duration-300 overflow-hidden ${cardHoverShadowClass}`}>
                    
                    {/* Recommendation Banner */}
                    {club.isRecommended && (
                        <motion.div 
                            className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1"
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300 }}
                        >
                            <Sparkles className="w-3 h-3"/> RECOMMENDED
                        </motion.div>
                    )}
                    
                    <CardContent className="p-8 flex flex-col items-center text-center text-white">
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: [-5, 5, -5, 5, 0] }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className={`p-3 rounded-full bg-gray-800/80 border-2 ${iconBorderClass}`}
                        >
                            {club.icon}
                        </motion.div>
                        
                        <h2 className={`mt-6 text-2xl font-bold text-transparent bg-clip-text ${titleGradientClass}`}>
                            {club.name}
                        </h2>
                        
                        <p className="mt-2 text-gray-300 text-base">{club.desc}</p>
                        
                        {/* 🏆 EXPLORE & JOIN BUTTON WITH DYNAMIC ROUTE */}
                        <motion.div whileTap={{ scale: 0.95 }} className="w-full mt-6">
                            {/* Link to the dynamic route, using club.domain as the slug */}
                            <Link href={`/phase2/technical-clubs/${club.domain}`}>
                                <Button 
                                    variant="default" 
                                    className={`w-full text-white font-semibold text-lg rounded-xl transition duration-300 ${theme.buttonBg}`}
                                >
                                    Explore & Join
                                </Button>
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>
            </Tilt>
        </motion.div>
    );
}