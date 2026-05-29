"use client";

import { useEffect, useRef } from "react";

export default function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      // noop — re-reads on attribute changes
    });
    observer.observe(document.documentElement, {
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="progress-bar">
      <i ref={ref} />
    </div>
  );
}
