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

export default function SectionScale() {
  const r1 = useCard3D();
  const r2 = useCard3D();
  const r3 = useCard3D();

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="page is-active"
      data-index={3}
    >
      <div className="page-inner">
        <motion.h2 variants={child} className="section-title">
          Why This Property
        </motion.h2>
        <motion.p variants={child} className="section-desc">
          Quality construction, prime location, excellent value.
        </motion.p>

        <motion.div variants={child} className="metrics">
          <div ref={r1} className="metric card-3d">
            <div className="metric-val">2,400</div>
            <div className="metric-label">Sq Ft</div>
          </div>
          <div ref={r2} className="metric card-3d">
            <div className="metric-val">2021</div>
            <div className="metric-label">Built</div>
          </div>
          <div ref={r3} className="metric card-3d">
            <div className="metric-val">5</div>
            <div className="metric-label">Min to Transit</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
