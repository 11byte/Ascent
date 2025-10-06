// src/app/phase2/technical-clubs/[slug]/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
// Assuming Button is correctly imported via alias
import { Button } from "../components/ui/button"; 
// Lucide icons needed for the page content
import { User, Layers, ArrowLeft, Brain, Code, Terminal, Shield, BarChart, Chrome, Cloud } from 'lucide-react';
import React from 'react';

// ===============================================
// 1. DATA AND TYPE DEFINITIONS
// ===============================================

// Theme Map (Static lookups for safe Tailwind class generation)
const themeMap: Record<string, { color: string, ring: string }> = {
    'fuchsia': { color: 'text-fuchsia-400', ring: 'ring-fuchsia-500' },
    'cyan': { color: 'text-cyan-400', ring: 'ring-cyan-500' },
    'red': { color: 'text-red-400', ring: 'ring-red-500' },
    'lime': { color: 'text-lime-400', ring: 'ring-lime-500' },
    'blue': { color: 'text-blue-400', ring: 'ring-blue-500' },
};

type Club = {
    name: string;
    tagline: string;
    themeKey: keyof typeof themeMap;
    icon: React.ComponentType<any>;
    description: string;
    activities: string[];
    coreMembers: { name: string; role: string; domain: string }[];
};

interface ClubPageProps {
    params: { slug: string };
}

const clubDetails: Record<string, Club> = {
    'ai-ml': {
        name: "Cognito AI Labs",
        tagline: "Building Intelligence, One Model at a Time.",
        themeKey: 'fuchsia',
        icon: Brain,
        description: "The **Cognito AI Labs** focuses on cutting-edge deep learning, Generative AI research, and practical machine learning engineering (MLOps). Our goal is to train students to deploy scalable AI solutions in real-world environments.",
        activities: [
            "Weekly Deep Learning Workshops (PyTorch/TensorFlow)",
            "Monthly Generative AI Challenges",
            "MLOps and Cloud Deployment Sprints",
            "Ethical AI and Data Bias Seminars"
        ],
        coreMembers: [
            { name: "Aditya Sharma", role: "President (ML Eng)", domain: "Generative AI" },
            { name: "Priya Varma", role: "VP (Research)", domain: "Computer Vision" },
            { name: "Karan Mehta", role: "MLOps Lead", domain: "Cloud Deployment" },
        ],
    },
    'devops': {
        name: "Aether Cloud Ops",
        tagline: "The Infrastructure is the Code.",
        themeKey: 'cyan',
        icon: Cloud,
        description: "Aether Cloud Ops is dedicated to mastering cloud platforms, containerization (Docker/K8s), and ensuring scalable, reliable systems through CI/CD practices.",
        activities: [
            "Weekly Kubernetes and Docker Labs",
            "Cloud Security and Monitoring Sessions",
            "Infrastructure as Code (Terraform) Practice",
            "SRE Principles and Alerting"
        ],
        coreMembers: [
            { name: "Kiran Rao", role: "DevOps Lead", domain: "Kubernetes" },
            { name: "Meera Singh", role: "Cloud Architect", domain: "AWS/Terraform" },
            { name: "Sandeep Yadav", role: "SRE Analyst", domain: "Monitoring/Alerting" },
        ],
    },
    'cyber-sec': {
        name: "Aegis Security",
        tagline: "Guardians of the Digital Realm.",
        themeKey: 'red',
        icon: Shield,
        description: "Aegis Security specializes in penetration testing, threat analysis, incident response, and collegiate Capture The Flag (CTF) contests.",
        activities: [
            "Weekly Penetration Testing Workshops",
            "Monthly Threat Intelligence Briefings",
            "CTF Team Training and Competitions",
            "Web Vulnerability Assessment"
        ],
        coreMembers: [
            { name: "Rohit Kumar", role: "Security Lead", domain: "Penetration Testing" },
            { name: "Anita Desai", role: "Incident Response Coordinator", domain: "Cyber Defense" },
            { name: "Vikram Shah", role: "Forensics Analyst", domain: "Network Forensics" },
        ],
    },
    'data-science': {
        name: "Nexus Data Core",
        tagline: "Transforming Data into Insight.",
        themeKey: 'lime',
        icon: BarChart,
        description: "Nexus Data Core focuses on statistical modeling, big data visualization, and predictive analytics using Python and R.",
        activities: [
            "Weekly Data Analysis Workshops (Pandas/NumPy)",
            "Monthly Visualization Challenges (Power BI/Tableau)",
            "Predictive Modeling Hackathons",
            "A/B Testing and Experiment Design"
        ],
        coreMembers: [
            { name: "Sanjay Patel", role: "Data Science Lead", domain: "Statistical Modeling" },
            { name: "Megha Joshi", role: "Visualization Expert", domain: "Data Viz" },
            { name: "Vishal Rao", role: "ML Engineer", domain: "Predictive Models" },
        ],
    },
    'gdsc': {
        name: "Google Developers Club",
        tagline: "Building Solutions for Local Impact.",
        themeKey: 'blue',
        icon: Chrome,
        description: "GDSC focuses on Android, Flutter, Firebase, Google Cloud, and community-driven projects.",
        activities: [
            "Weekly Flutter Development Sessions",
            "Firebase Integration Workshops",
            "Google Cloud Certification Study Groups",
            "Hackathons for Social Good"
        ],
        coreMembers: [
            { name: "Rahul Singh", role: "GDSC Lead", domain: "Flutter/Dart" },
            { name: "Nisha Verma", role: "Cloud Specialist", domain: "Google Cloud" },
            { name: "Anjali Gupta", role: "Android Dev", domain: "Native Android" },
        ],
    },
};

// ===============================================
// 2. MAIN COMPONENT
// ===============================================

export default function ClubDetailPage({ params }: ClubPageProps) {
    // 1. Get club data based on slug
    const slug = params.slug as keyof typeof clubDetails;
    const club = clubDetails[slug];

    if (!club) {
        return <div className="min-h-screen bg-gray-900 text-white p-10">404 Club Not Found: {slug}</div>;
    }

    // 2. Apply dynamic theming
    const theme = themeMap[club.themeKey];
    const IconComponent = club.icon; 

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-10 lg:px-20 bg-gray-900 relative">
            
            {/* Background Gradient/Glow (Themed) */}
            <div className={`absolute top-0 left-1/2 w-[600px] h-[600px] bg-${club.themeKey}-900/30 rounded-full blur-[200px] -translate-x-1/2 -z-0`}></div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <motion.div 
                className="relative z-10 w-full max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                <Link href="/phase2/technical-clubs" passHref>
                    <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Clubs
                    </Button>
                </Link>

                {/* Club Header Section (Themed) */}
                <motion.header 
                    className={`p-8 rounded-2xl border border-${club.themeKey}-500/50 bg-gray-800/70 shadow-2xl mb-12`}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <div className="flex items-center space-x-4 mb-4">
                        {/* Club Icon */}
                        {IconComponent && <IconComponent className={`w-12 h-12 ${theme.color}`} />}
                        <h1 className={`text-5xl font-extrabold ${theme.color}`}>
                            {club.name}
                        </h1>
                    </div>
                    
                    <p className={`mt-2 text-xl italic text-gray-200`}>{club.tagline}</p>
                    <p className="mt-4 text-gray-300 max-w-4xl">{club.description}</p>
                    
                    <Button 
                        variant="default" 
                        className={`mt-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold`}
                    >
                        <Layers className="w-5 h-5 mr-2" /> Request to Join
                    </Button>
                </motion.header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Core Member Section */}
                    <div className="lg:col-span-2">
                        <h2 className={`text-3xl font-bold mb-5 ${theme.color} flex items-center`}>
                            <User className={`w-6 h-6 mr-3 ${theme.color}`} /> Core Team
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {club.coreMembers.map((member, index) => (
                                <motion.div 
                                    key={index} 
                                    className={`p-4 rounded-xl border border-${club.themeKey}-500/50 bg-gray-800/70 shadow-md transition-all duration-300 hover:ring-2 ${theme.ring}`}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                                    <p className={`text-sm font-medium mt-1 ${theme.color}`}>{member.role}</p>
                                    <p className="text-xs text-gray-400 mt-2">Focus: {member.domain}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="lg:col-span-1">
                        <h2 className={`text-3xl font-bold mb-5 ${theme.color} flex items-center`}>
                            <Terminal className={`w-6 h-6 mr-3 ${theme.color}`} /> Key Activities
                        </h2>
                        <ul className={`space-y-3 p-4 rounded-xl bg-gray-800/70 border border-${club.themeKey}-500/50`}>
                            {club.activities.map((activity, index) => (
                                <motion.li 
                                    key={index} 
                                    className="flex items-start text-gray-300 text-sm"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                >
                                    <Code className={`w-4 h-4 mt-1 mr-2 flex-shrink-0 ${theme.color}`} />
                                    {activity}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}