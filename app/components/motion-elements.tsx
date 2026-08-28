"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MotionElementProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: MotionElementProps) {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? 0 : 36;
  const initial = {
    opacity: 0,
    x: direction === "left" ? -offset : direction === "right" ? offset : 0,
    y: direction === "up" ? offset : 0,
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function TactileTag({ children, className, delay = 0 }: MotionElementProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 22, rotate: reduceMotion ? 0 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: delay % 0.2 === 0 ? -1 : 1 }}
      whileHover={reduceMotion ? undefined : { y: -7, rotate: 0, scale: 1.025 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 310, damping: 22, delay }}
    >
      {children}
    </motion.span>
  );
}

export function InsightRow({ children, className, delay = 0, direction = "left" }: MotionElementProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      className={className}
      initial={{
        opacity: 0,
        x: reduceMotion ? 0 : direction === "left" ? -44 : 44,
      }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={reduceMotion ? undefined : { x: 7 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.li>
  );
}

export function CollageCard({ children, className, delay = 0 }: MotionElementProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 30, scale: reduceMotion ? 1 : 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function AmbientDecor({ children, className, delay = 0 }: MotionElementProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 9, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
