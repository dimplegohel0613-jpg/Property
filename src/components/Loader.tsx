"use client";

import { useEffect, useRef } from "react";

interface LoaderProps {
  progress: number;
  total: number;
  visible: boolean;
}

export default function Loader({ progress, total, visible }: LoaderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pct = Math.min(100, Math.round((progress / total) * 100));
    if (numRef.current) numRef.current.textContent = String(pct);
    if (barRef.current) barRef.current.style.width = pct + "%";
  }, [progress, total]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.toggle("hidden", !visible);
  }, [visible]);

  return (
    <div id="loader" ref={rootRef} className={visible ? "" : "hidden"}>
      <div className="loader-inner">
        <div className="loader-brand">Dimple</div>
        <p className="loader-tagline">Property For Sale</p>
        <div className="loader-pct-wrap" aria-live="polite">
          <span className="loader-pct-num" ref={numRef}>
            {Math.min(100, Math.round((progress / total) * 100))}
          </span>
          <span className="loader-pct-suffix">%</span>
        </div>
        <div id="loader-bar-wrap">
          <div
            id="loader-bar"
            ref={barRef}
            style={{
              width: `${Math.min(100, Math.round((progress / total) * 100))}%`,
            }}
          />
        </div>
        <p className="loader-caption" ref={captionRef}>
          Loading experience...
        </p>
        <div className="loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
