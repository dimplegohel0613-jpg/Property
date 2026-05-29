"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const selector = "a, button, .btn, .nav-links a, .nav-brand, .badge";
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(selector)) {
        if (!hoveringRef.current) {
          hoveringRef.current = true;
          ringRef.current?.classList.add("cursor-ring-hover");
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      if (hoveringRef.current && !(e.target as HTMLElement).closest(selector)) {
        hoveringRef.current = false;
        ringRef.current?.classList.remove("cursor-ring-hover");
      }
    };

    function lerp() {
      const { x, y } = posRef.current;
      ringPosRef.current.x += (x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (y - ringPosRef.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(lerp);
    }

    rafRef.current = requestAnimationFrame(lerp);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="cursorDot" ref={dotRef} className="cursor-dot" style={{ transform: "translate(0, 0)" }} />
      <div id="cursorRing" ref={ringRef} className="cursor-ring" style={{ transform: "translate(0, 0)" }} />
    </>
  );
}
