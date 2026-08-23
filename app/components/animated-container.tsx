"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ComponentProps {
  children: ReactNode;
  bgSource?: string;
}

export default function AnimatedContainer({
  children,
  bgSource,
}: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, transition: {duration: 1} }}
      animate={{ opacity: 1, transition: { duration: 1 } }}
      exit={{ opacity: 0, transition: {duration: 1} }}
      className="h-screen w-screen bg-cover bg-bottom-right overflow-x-hidden"
      style={
        bgSource
          ? { backgroundImage: `url("${bgSource}")` }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
