"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const child = {
  hidden: { opacity: 0, y: 50, scale: 0.92, filter: "blur(5px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function SectionCTA() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="page is-active"
      data-index={4}
    >
      <div
        className="page-inner"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <motion.h2
          variants={child}
          className="section-title"
          style={{ maxWidth: 800 }}
        >
          Interested?
        </motion.h2>
        <motion.p
          variants={child}
          className="section-desc"
          style={{ marginBottom: 40 }}
        >
          Reach out for a private showing.
        </motion.p>

        <motion.div variants={child} className="input-group" style={{ width: "100%" }}>
          <input type="email" placeholder="your@email.com" />
          <button
            className="btn btn-primary"
            style={{ padding: "16px 32px" }}
            onClick={(e) => e.preventDefault()}
          >
            Send
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
