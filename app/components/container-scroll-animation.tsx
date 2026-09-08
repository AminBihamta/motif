"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";

type ContainerScrollProps = {
  titleComponent: string | ReactNode;
  children: ReactNode;
};

export function ContainerScroll({
  titleComponent,
  children,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => (isMobile ? [0.85, 1] : [1.15, 1]);

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [20, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : scaleDimensions(),
  );
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -100],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{ perspective: reduceMotion ? undefined : "1000px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow: "0 24px 60px -12px color-mix(in srgb, var(--color-motif-ivory) 55%, transparent)",
      }}
      className="mx-auto -mt-12 aspect-video w-full max-w-6xl rounded-2xl bg-transparent md:rounded-3xl lg:max-w-7xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl md:rounded-3xl">
        {children}
      </div>
    </motion.div>
  );
}
