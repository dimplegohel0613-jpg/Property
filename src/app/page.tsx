"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import CanvasBackground from "@/components/CanvasBackground";
import SectionHero from "@/components/SectionHero";
import SectionBento from "@/components/SectionBento";
import SectionAgents from "@/components/SectionAgents";
import SectionScale from "@/components/SectionScale";
import SectionCTA from "@/components/SectionCTA";
import CustomCursor from "@/components/CustomCursor";
import TourOverlay from "@/components/TourOverlay";

const PAGE_COUNT = 5;

export default function Home() {
  const [ready, setReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 1 });
  const [totalFrames, setTotalFramesState] = useState(960);
  const [activePage, setActivePage] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const targetFrameRef = useRef(0);
  const frameUpdaterRef = useRef<((target: number) => void) | null>(null);

  const registerFrameUpdater = useCallback((fn: (target: number) => void) => {
    frameUpdaterRef.current = fn;
  }, []);

  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      const maxF = Math.max(0, totalFrames - 1);
      const t =
        ((Math.max(0, Math.min(PAGE_COUNT - 1, sectionIndex)) + 0.5) /
          PAGE_COUNT) *
        maxF;
      targetFrameRef.current = t;
      if (frameUpdaterRef.current) {
        frameUpdaterRef.current(t);
      }
    },
    [totalFrames]
  );

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  const handleLoadProgress = useCallback(
    (loaded: number, total: number) => {
      setLoadingProgress({ loaded, total });
    },
    []
  );

  const handleSetTotalFrames = useCallback((n: number) => {
    setTotalFramesState(n);
  }, []);

  const closeTour = useCallback(() => {
    setTourOpen(false);
    targetFrameRef.current = 0;
    if (frameUpdaterRef.current) frameUpdaterRef.current(0);
  }, []);

  const openTour = useCallback(() => {
    setTourOpen(true);
  }, []);

  // Derive activePage from scroll progress
  useEffect(() => {
    let rafId: number;
    function update() {
      const scrollVal = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--scroll")
      );
      if (!isNaN(scrollVal)) {
        let idx = Math.floor(scrollVal * PAGE_COUNT);
        idx = Math.max(0, Math.min(PAGE_COUNT - 1, idx));
        setActivePage(idx);
      }
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Scroll handler
  useEffect(() => {
    if (!ready) return;

    const onWheel = (e: WheelEvent) => {
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 30;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      const raw = delta * 0.012;
      const sign = Math.sign(raw);
      const abs = Math.abs(raw);
      const minMove = 0.4;
      targetFrameRef.current += abs < minMove ? sign * minMove : raw;
      const cap = Math.max(0, totalFrames - 1);
      targetFrameRef.current = Math.max(
        0,
        Math.min(targetFrameRef.current, cap)
      );
      if (frameUpdaterRef.current) {
        frameUpdaterRef.current(targetFrameRef.current);
      }
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dy = lastTouchY - y;
      lastTouchY = y;
      targetFrameRef.current += dy * 0.08;
      const cap = Math.max(0, totalFrames - 1);
      targetFrameRef.current = Math.max(
        0,
        Math.min(targetFrameRef.current, cap)
      );
      if (frameUpdaterRef.current) {
        frameUpdaterRef.current(targetFrameRef.current);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [ready, totalFrames]);

  return (
    <>
      <Loader
        progress={loadingProgress.loaded}
        total={loadingProgress.total}
        visible={!ready}
      />

      <CanvasBackground
        onReady={handleReady}
        registerFrameUpdater={registerFrameUpdater}
        totalFrames={totalFrames}
        setTotalFrames={handleSetTotalFrames}
        onLoadProgress={handleLoadProgress}
      />

      <div id="overlay-layer" />

      <ProgressBar />

      <div id="ui-layer">
        <Navbar activeIndex={activePage} onNavClick={scrollToSection} />

        <main className={`stage${tourOpen ? " stage-hidden" : ""}`}>
          <AnimatePresence mode="wait">
            {activePage === 0 && <SectionHero key="hero" onTourClick={openTour} />}
            {activePage === 1 && <SectionBento key="bento" />}
            {activePage === 2 && <SectionAgents key="agents" />}
            {activePage === 3 && <SectionScale key="scale" />}
            {activePage === 4 && <SectionCTA key="cta" />}
          </AnimatePresence>
        </main>
      </div>

      {tourOpen && <TourOverlay onClose={closeTour} />}
      <CustomCursor />
    </>
  );
}
