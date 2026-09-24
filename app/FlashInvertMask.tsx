import type { ReactNode } from "react";

type FlashInvertMaskProps = {
  /** Whatever you want the flash to invert — text, images, other elements. */
  children: ReactNode;
  /** Path to the flash SVG in /public. Default "/flash.svg". */
  maskImage?: string;
  /** Distance from the top edge of this container. Use vh for viewport-relative. */
  offsetTop?: string;
  /** Distance from the right edge of this container. Use vw for viewport-relative. */
  offsetRight?: string;
  /** Rendered size of the flash shape, e.g. "260px 368px" (width height) or a single value. */
  maskSize?: string;
  /** Extra classes for the wrapping container (e.g. min-h-[...] if children are short). */
  className?: string;
  /**
   * Color used for the inverting overlay. Because mix-blend-mode: difference
   * computes |color - background| per pixel, and difference(color, black) =
   * color exactly, wherever this shape overlaps black text, the text will
   * render in exactly this color. Default "#ffffff" (white).
   */
  overlayColor?: string;
};

/**
 * Wraps its children in a container that inverts (mix-blend-mode: difference)
 * whatever is behind the flash-shaped mask. By default the mask layer fills
 * this container completely (absolute inset-0), so the container is sized
 * exactly like a normal div wrapping its children — give it a min-h-[...]
 * via className if the children are shorter than the flash shape itself.
 */
export default function FlashInvertMask({
  children,
  maskImage = "/flash.svg",
  offsetTop = "10vh",
  offsetRight = "10vw",
  maskSize = "45vw",
  className = "",
  overlayColor = "#ffffff",
}: FlashInvertMaskProps) {
  return (
    <div className={`relative isolate ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-difference"
        style={{
          backgroundColor: overlayColor,
          WebkitMaskImage: `url('${maskImage}')`,
          maskImage: `url('${maskImage}')`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: `right ${offsetRight} top ${offsetTop}`,
          maskPosition: `right ${offsetRight} top ${offsetTop}`,
          WebkitMaskSize: maskSize,
          maskSize: maskSize,
        }}
      />
    </div>
  );
}