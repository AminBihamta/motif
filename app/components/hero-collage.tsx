"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Reveal } from "./motion-elements";

export type HeroCollageImage = {
  src: string;
  alt: string;
};

const SLOT_INTERVALS_MS = [2200, 2700, 3100, 3600] as const;
const SLOT_START_OFFSETS_MS = [0, 850, 1700, 2550] as const;

function nextIndex(current: number, length: number, avoid: number[]) {
  if (length <= 1) return 0;

  let next = (current + 1 + Math.floor(Math.random() * (length - 1))) % length;
  let attempts = 0;
  while (avoid.includes(next) && attempts < length) {
    next = (next + 1) % length;
    attempts += 1;
  }
  return next;
}

function HeroCollageSlot({
  images,
  intervalMs,
  startOffsetMs,
  className,
  priority,
}: {
  images: HeroCollageImage[];
  intervalMs: number;
  startOffsetMs: number;
  className?: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIndex((current) => nextIndex(current, images.length, [current]));
      }, intervalMs);
    }, startOffsetMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [images.length, intervalMs, reduceMotion, startOffsetMs]);

  const image = images[index] ?? images[0];
  if (!image) return null;

  return (
    <div className={`group relative overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={image.src}
          className="absolute inset-0"
          initial={
            reduceMotion ? false : { opacity: 0, scale: 1.04 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 50vw, 28vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroCollage({
  pools,
}: {
  pools: HeroCollageImage[][];
}) {
  return (
    <Reveal
      className="relative grid min-h-[28rem] grid-cols-2 grid-rows-2 border-t-2 border-motif-ivory lg:min-h-full lg:border-l-2 lg:border-t-0"
      direction="right"
      delay={0.12}
    >
      {pools.slice(0, 4).map((images, index) => (
        <HeroCollageSlot
          key={`slot-${index}`}
          images={images}
          intervalMs={SLOT_INTERVALS_MS[index] ?? 4000}
          startOffsetMs={SLOT_START_OFFSETS_MS[index] ?? index * 800}
          priority={index < 2}
          className={`${index % 2 === 0 ? "border-r-2 border-motif-ivory" : ""} ${
            index < 2 ? "border-b-2 border-motif-ivory" : ""
          }`}
        />
      ))}
    </Reveal>
  );
}
