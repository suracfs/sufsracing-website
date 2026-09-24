"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type SponsorLogo = {
  src: string;
  alt: string;
};

type SponsorMarqueeProps = {
  logos: SponsorLogo[];
  lines?: number;
  speed?: number;
  logoHeight?: number;
};

function splitIntoLines(logos: SponsorLogo[], lines: number): SponsorLogo[][] {
  const rows: SponsorLogo[][] = Array.from({ length: lines }, () => []);

  logos.forEach((logo, i) => {
    rows[i % lines].push(logo);
  });

  return rows;
}

function MarqueeRow({
  logos,
  offset,
  speed,
  logoHeight,
}: {
  logos: SponsorLogo[];
  offset: boolean;
  speed: number;
  logoHeight: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (logos.length === 0) return null;

  /*
   * Every logo slot is ALWAYS exactly 25% of the parent.
   */
  const slotWidth = containerWidth / 4;

  /*
   * We duplicate the logos so the animation can loop seamlessly.
   */
  const track = [...logos, ...logos];

  /*
   * The track contains the logos at a fixed physical width.
   *
   * One complete copy of the logos has:
   *     logos.length × 25% of parent width
   *
   * Therefore translating the track by exactly that amount
   * gives us a perfect seamless loop.
   */
  const loopDistance = slotWidth * logos.length;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
        maskImage:
          "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
      }}
    >
      <div
        className="relative flex w-max"
        style={{
          transform: offset
            ? `translateX(-${slotWidth / 2}px)`
            : undefined,
        }}
      >
        <div
          className="flex w-max motion-reduce:!animate-none hover:[animation-play-state:paused]"
          style={{
            animation: `sponsor-scroll-${logos.length}-${offset ? "offset" : "normal"} ${speed}s linear infinite`,
            ["--loop-distance" as string]: `${loopDistance}px`,
          }}
        >
          {track.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="flex shrink-0 items-center justify-center opacity-60 transition-opacity hover:opacity-100"
              style={{
                width: `${slotWidth}px`,
                height: `${logoHeight}px`,
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes={`${Math.round(
                    (slotWidth / Math.max(containerWidth, 1)) * 100
                  )}vw`}
                  className="object-contain grayscale"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sponsor-scroll-${logos.length}-normal {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-1 * var(--loop-distance)));
          }
        }

        @keyframes sponsor-scroll-${logos.length}-offset {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-1 * var(--loop-distance)));
          }
        }
      `}</style>
    </div>
  );
}

export default function SponsorMarquee({
  logos,
  lines = 1,
  speed = 30,
  logoHeight = 80,
}: SponsorMarqueeProps) {
  const rows = splitIntoLines(logos, Math.max(1, lines));

  return (
    <div className="flex w-full flex-col gap-8">
      {rows.map((rowLogos, i) => (
        <MarqueeRow
          key={i}
          logos={rowLogos}
          offset={i % 2 === 1}
          speed={speed}
          logoHeight={logoHeight}
        />
      ))}
    </div>
  );
}