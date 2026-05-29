"use client";

import { motion } from "framer-motion";

interface SectionProps { onTourClick?: () => void }

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const child = {
  hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function SectionHero({ onTourClick }: SectionProps) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="page is-active"
      data-index={0}
    >
      <div className="page-inner">
        <motion.h1 variants={child} className="hero-title">
          For Sale
        </motion.h1>
        <motion.p variants={child} className="hero-desc">
          Prime property in a sought-after location.
        </motion.p>
        <motion.div variants={child} className="btn-group">
          <button
            className="btn btn-secondary"
            onClick={(e) => { e.preventDefault(); onTourClick?.(); }}
          >
            Schedule a Tour
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
