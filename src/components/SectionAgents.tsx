"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function useCard3D() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateZ(10px)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return ref;
}

function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useCard3D();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(4px)" },
        visible: {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        },
      }}
    >
      <div ref={ref} className={`bento-card card-3d ${className}`}>
        {children}
      </div>
    </motion.div>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const child = {
  hidden: { opacity: 0, y: 50, scale: 0.92, filter: "blur(5px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function SectionAgents() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="page is-active"
      data-index={2}
    >
      <div className="page-inner">
        <motion.h2 variants={child} className="section-title">
          The Neighborhood
        </motion.h2>
        <motion.p variants={child} className="section-desc">
          Quiet streets, great schools, vibrant community.
        </motion.p>

        <motion.div variants={child} className="bento-grid">
          <Card3D className="col-span-1">
            <h3>Parks &amp; Trails</h3>
            <p>Minutes from green spaces and walking paths.</p>
          </Card3D>
          <Card3D className="col-span-1">
            <h3>Top Schools</h3>
            <p>Within award-winning school district.</p>
          </Card3D>
          <Card3D className="col-span-1">
            <h3>Local Amenities</h3>
            <p>Cafés, markets, and entertainment nearby.</p>
          </Card3D>
        </motion.div>
      </div>
    </motion.section>
  );
}
