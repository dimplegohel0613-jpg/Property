"use client";

import { useEffect, useRef } from "react";

interface CanvasBackgroundProps {
  onReady: () => void;
  registerFrameUpdater: (fn: (target: number) => void) => void;
  totalFrames: number;
  setTotalFrames: (n: number) => void;
  onLoadProgress: (loaded: number, total: number) => void;
}

const LOAD_CONCURRENCY = 48;
const FRAME_DIR = "/frames";
const PARALLAX_STRENGTH = 40;
const SCALE_EXTRA = 0.08;

export default function CanvasBackground({
  onReady,
  registerFrameUpdater,
  totalFrames,
  setTotalFrames,
  onLoadProgress,
}: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const isReadyRef = useRef(false);
  const rafRef = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let totalFramesLocal = 950;
    const imgCache: (HTMLImageElement | null)[] = [];
    imagesRef.current = imgCache;

    function framePath(i: number) {
      return `${FRAME_DIR}/frame_${String(i + 1).padStart(6, "0")}.webp`;
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function loadImageSlot(i: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const finish = async () => {
          imgCache[i] = img;
          try {
            if (img.decode) await img.decode();
          } catch (_) {}
          resolve();
        };
        img.onload = () => finish();
        img.onerror = () => {
          imgCache[i] = null;
          resolve();
        };
        img.src = framePath(i);
      });
    }

    async function loadAllFramesParallel(total: number) {
      let nextIndex = 0;
      let completed = 0;

      async function worker() {
        while (true) {
          const i = nextIndex++;
          if (i >= total) return;
          await loadImageSlot(i);
          completed++;
          onLoadProgress(completed, total);
        }
      }

      const n = Math.min(LOAD_CONCURRENCY, total);
      await Promise.all(Array.from({ length: n }, () => worker()));
    }

    function drawFrame(frameFloat: number) {
      const cap = Math.max(0, totalFramesLocal - 1);
      let idx = Math.round(frameFloat);
      idx = Math.max(0, Math.min(idx, cap));
      const img = imgCache[idx];
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      if (!img || !img.naturalWidth) {
        ctx!.fillStyle = "#000";
        ctx!.fillRect(0, 0, cw, ch);
        return;
      }
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const baseScale = Math.max(cw / iw, ch / ih);
      const scale = baseScale * (1 + SCALE_EXTRA);
      const w = iw * scale;
      const h = ih * scale;

      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;
      const t = timeRef.current;
      const breath = Math.sin(t * 0.4) * 2;
      const idleRoll = Math.sin(t * 0.15) * 3;
      const offsetX = -mx * PARALLAX_STRENGTH + idleRoll;
      const offsetY = -my * PARALLAX_STRENGTH + breath;
      const x = (cw - w) / 2 + offsetX;
      const y = (ch - h) / 2 + offsetY;

      ctx!.drawImage(img, x, y, w, h);
    }

    function animate() {
      timeRef.current += 0.016;
      const cap = Math.max(0, totalFramesLocal - 1);
      targetFrameRef.current = Math.max(
        0,
        Math.min(targetFrameRef.current, cap)
      );
      currentFrameRef.current +=
        (targetFrameRef.current - currentFrameRef.current) * 0.1;
      currentFrameRef.current = Math.max(
        0,
        Math.min(currentFrameRef.current, cap)
      );
      drawFrame(currentFrameRef.current);
      const denom = Math.max(1, totalFramesLocal - 1);
      const progress = Math.min(1, currentFrameRef.current / denom);
      document.documentElement.style.setProperty("--scroll", String(progress));

      // Auto 3D rotation on canvas element
      const t = timeRef.current;
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;
      const ry = Math.sin(t * 0.12) * 1.5 + mx * 0.5;
      const rx = Math.sin(t * 0.08 + 1) * 0.8 + my * -0.5;
      if (canvas) {
        canvas.style.transform = `perspective(1200px) rotateY(${ry}deg) rotateX(${rx}deg) scale(1.02)`;
      }

      requestAnimationFrame(animate);
    }

    function startAnimLoop() {
      if (rafRef.current) return;
      rafRef.current = true;
      requestAnimationFrame(animate);
    }

    registerFrameUpdater((target: number) => {
      targetFrameRef.current = target;
    });

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    (async () => {
      totalFramesLocal = 950;
      setTotalFrames(totalFramesLocal);

      imgCache.length = totalFramesLocal;
      for (let i = 0; i < totalFramesLocal; i++) imgCache[i] = null;

      startAnimLoop();
      onLoadProgress(0, totalFramesLocal);

      await loadAllFramesParallel(totalFramesLocal);

      isReadyRef.current = true;
      onReady();
    })();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        objectFit: "cover",
        willChange: "transform",
      }}
    />
  );
}
