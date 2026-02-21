import { cn } from "../lib/utils";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import React from "react";

export const UserFlow = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full  bg-black flex items-center justify-center"
    >
      <GoogleGeminiEffect pathLengths={[pathLength]} />
    </div>
  );
};

const transition = {
  duration: 0,
  ease: "linear" as const,
};

export const GoogleGeminiEffect = ({
  pathLengths,
  className,
}: {
  pathLengths: MotionValue[];
  className?: string;
}) => {
  return (
    <div className={cn("sticky top-0 h-screen w-full", className)}>
      <svg
  width="600"
  height="1600"
  viewBox="0 0 600 1600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
      >
       <motion.path
  d="
    M300 0
    C 100 150, 500 300, 300 450
    S 100 750, 300 900
    S 500 1200, 300 1350
    S 100 1500, 300 1600
  "
  stroke="#FFB7C5"
  strokeWidth="4"
  fill="none"
  initial={{ pathLength: 0 }}
  style={{ pathLength: pathLengths[0] }}
/>
        {/* Soft Glow Background */}
        <path
  d="
    M300 0
    C 100 150, 500 300, 300 450
    S 100 750, 300 900
    S 500 1200, 300 1350
    S 100 1500, 300 1600
  "          stroke="#FFB7C5"
          strokeWidth="4"
          fill="none"
          filter="url(#blurMe)"
        />

        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
