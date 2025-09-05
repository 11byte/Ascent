import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  image: string;
  heading: string;
  id: string;
  features: string[];
};

export default function Section({ image, heading, id, features }: Props) {
  return (
    <section
      id={id}
      className="h-screen w-full flex flex-col items-center justify-center text-center px-4"
    >
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {heading}
      </motion.h1>

      <Image
        src={image}
        alt={heading}
        width={400}
        height={400}
        className="rounded-xl mb-8"
      />

      {/* Features with swinging animation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ rotate: i % 2 === 0 ? -10 : 10, opacity: 0, y: 30 }}
            whileInView={{ rotate: 0, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: i * 0.2,
            }}
            className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg text-lg font-medium text-white"
          >
            {f}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
