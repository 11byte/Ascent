"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const Calculator = () => {
  const [sgpas, setSgpas] = useState<(string | null)[]>(Array(8).fill(null));
  const [cgpa, setCgpa] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateSGPA = (index: number, value: string) => {
    const updated = [...sgpas];
    updated[index] = value;
    setSgpas(updated);
    setError(null);
  };

  const validateLinear = () => {
    let encounteredEmpty = false;

    for (let i = 0; i < sgpas.length; i++) {
      if (!sgpas[i] || sgpas[i] === "") {
        encounteredEmpty = true;
      } else if (encounteredEmpty) {
        return false;
      }
    }
    return true;
  };

  const calculateCGPA = () => {
    if (!validateLinear()) {
      setError("Please fill semesters in order (no skipping).");
      return;
    }

    let total = 0;
    let count = 0;

    sgpas.forEach((val) => {
      if (val) {
        total += parseFloat(val);
        count++;
      }
    });

    if (count === 0) {
      setError("Enter at least one semester SGPA.");
      return;
    }

    setCgpa((total / count).toFixed(2));
  };

  return (
    <div className="text-white">
      {/* Display */}
      <div className="bg-black/30 rounded-xl p-5 mb-5 backdrop-blur-xl border border-white/10">
        <div className="text-right text-3xl font-[Orbitron]">
          {cgpa ? `CGPA: ${cgpa}` : "Enter SGPA"}
        </div>
      </div>

      {/* Semester Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {sgpas.map((val, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
              type="number"
              step="0.01"
              placeholder={`Sem ${i + 1}`}
              value={val || ""}
              onChange={(e) => updateSGPA(i, e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800/60 backdrop-blur-lg outline-none border border-white/10 focus:border-orange-400 transition"
            />
          </motion.div>
        ))}
      </div>

      {/* Error */}
      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={calculateCGPA}
        className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-400 hover:opacity-90 transition shadow-lg"
      >
        Calculate CGPA
      </motion.button>
    </div>
  );
};
