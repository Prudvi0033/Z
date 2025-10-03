"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        {/* White gradient for hover effect */}
        <radialGradient id="whiteGradient">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Base outline (ghost, blended into bg) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-[helvetica] text-[100px] font-bold"
        style={{
          fill: "transparent",
          stroke: "#262626", // 🔹 ghost stroke, just above bg (#171717)
        }}
      >
        {text}
      </text>

      {/* Animated outline (subtle reveal animation) */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.25"
        className="fill-transparent font-[helvetica] text-[100px] font-bold"
        style={{
          stroke: "#404040", // 🔹 a bit lighter gray when animating
          opacity: 0.4,
        }}
        initial={{ strokeDashoffset: 600, strokeDasharray: 600 }}
        animate={{
          strokeDashoffset: hovered ? 0 : 600,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Hover reveal (bright inner text) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.2"
        mask="url(#textMask)"
        className="font-[helvetica] text-[100px] font-bold"
        style={{
          fill: "url(#whiteGradient)",
          stroke: "rgba(255, 255, 255, 0.6)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </text>
    </svg>
  );
};
