"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";

type HoloCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Default 14. */
  maxTilt?: number;
  /** Strength of the holographic sheen, 0–1. Default 0.6. */
  glareStrength?: number;
};

/**
 * Wraps any content in a pointer-reactive tilt + holographic glare,
 * the "Pokemon card" effect. Uses CSS custom properties updated via
 * requestAnimationFrame so it doesn't trigger React re-renders per
 * mouse move. Disables itself under prefers-reduced-motion.
 */
export default function HoloCard({
  children,
  className = "",
  maxTilt = 14,
  glareStrength = 0.6,
}: HoloCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0 -> 1
      const py = (e.clientY - rect.top) / rect.height; // 0 -> 1

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rx = (py - 0.5) * -maxTilt * 2; // rotateX
        const ry = (px - 0.5) * maxTilt * 2; // rotateY
        el.style.setProperty("--px", `${px * 100}%`);
        el.style.setProperty("--py", `${py * 100}%`);
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      });
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    setActive(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <div
      ref={ref}
      className={`holo-card group relative [perspective:900px] ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={handlePointerLeave}
      style={{ "--glare": glareStrength } as React.CSSProperties}
    >
      <div
        className="relative h-full w-full rounded-xl transition-transform duration-150 ease-out motion-reduce:!transform-none [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
      >
        {children}

        {/* Holographic sheen overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-color-dodge transition-opacity duration-200 motion-reduce:hidden"
          style={{
            opacity: active ? "var(--glare)" : 0,
            background:
              "radial-gradient(circle at var(--px,50%) var(--py,50%), rgba(255,255,255,0.9), rgba(120,200,255,0.35) 30%, rgba(255,120,220,0.35) 55%, transparent 70%)",
          }}
        />
        {/* Thin rainbow foil line for extra sparkle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay transition-opacity duration-200 motion-reduce:hidden"
          style={{
            opacity: active ? "var(--glare)" : 0,
            background:
              "linear-gradient(115deg, transparent 20%, rgba(255,0,120,0.5) 36%, rgba(255,220,0,0.5) 44%, rgba(0,220,255,0.5) 52%, transparent 68%)",
            backgroundSize: "300% 300%",
            backgroundPosition: "var(--px,50%) var(--py,50%)",
          }}
        />
      </div>
    </div>
  );
}