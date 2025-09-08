"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClubCardProps {
  name: string;
  icon: React.ReactNode;
  desc: string;
}

export default function ClubCard({ name, icon, desc }: ClubCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Tilt glareEnable glareMaxOpacity={0.2} scale={1.05}>
        <Card className="rounded-2xl shadow-md border border-red-400 hover:shadow-xl transition overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {name}
            </h2>
            <p className="mt-2 text-gray-600 text-sm">{desc}</p>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2">
                Join Now
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </Tilt>
    </motion.div>
  );
}
