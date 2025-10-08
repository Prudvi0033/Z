'use client'
import { Montserrat, Tangerine } from "next/font/google";
import { motion } from "motion/react";
const monte = Montserrat({ subsets: ["latin"], weight: ["700"] });
const tangi = Tangerine({ subsets: ["latin"], weight: ["700"] });
const Footer = () => {
  return (
    <div
      className={`min-h-screen selection:bg-neutral-300/40 text-white flex items-center px-32 justify-center ${monte.className}`}
    >
      <div
        className={`flex flex-col w-fit items-center justify-center ${tangi.className}`}
      >
        <span className="text-2xl text-neutral-700">
          Designed & Developer by
        </span>
        <a
          href="https://x.com/prudvi_uchiha"
          target="_blank"
          className="text-3xl flex gap-x-1 items-center justify-center text-neutral-300 cursor-pointer"
        >
          <motion.span
            className="relative text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 via-white to-neutral-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            Prudvi
          </motion.span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
