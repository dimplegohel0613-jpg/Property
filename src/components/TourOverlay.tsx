"use client";

import { useEffect, useRef, useState } from "react";

export default function TourOverlay({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    el.classList.add("tour-visible");

    const timeout = setTimeout(onClose, 10000);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timeout);
      el.classList.remove("tour-visible");
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div
        ref={overlayRef}
        className="tour-overlay tour-visible"
        role="dialog"
        aria-modal="true"
      >
        <div className="tour-overlay-bg" />
        <div className="tour-card tour-success">
          <div className="tour-checkmark-wrap">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path d="M16 24l6 6 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="tour-card-title">Thank You!</h2>
          <p className="tour-card-desc">
            Your tour request has been received. Our team will contact you shortly to confirm your visit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="tour-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="tour-overlay-bg" />
      <div className="tour-card" onClick={(e) => e.stopPropagation()}>
        <button className="tour-x" onClick={onClose} aria-label="Close tour">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="tour-card-title">Schedule a Tour</h2>
        <p className="tour-card-desc">
          Experience a personalized walkthrough of your dream property.
        </p>
        <form className="tour-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" className="tour-input" required />
          <input type="email" placeholder="Your email" className="tour-input" required />
          <input type="date" className="tour-input" required />
          <button type="submit" className="tour-submit">Submit</button>
        </form>
      </div>
      <p className="tour-hint">Click anywhere · Esc · auto-closes in 10s</p>
    </div>
  );
}
