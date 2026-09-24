import type { ReactNode, ElementType, CSSProperties } from "react";

type FlashTextEffectProps = {
  /** The heading text/content — rendered once normally, once as an invert layer. */
  children: ReactNode;
  /** HTML tag for the heading. Default "h1". */
  as?: ElementType;
  /** Typography classes shared by both the real heading and its invert twin. */
  className?: string;
  /** Path to the flash SVG in /public, used only when rotate=0 and scale=1. Default "/flash.svg". */
  maskImage?: string;
  /** Distance from the top edge of the container. Use vh for viewport-relative. */
  offsetTop?: string;
  /** Distance from the left edge of the container. Use vw for viewport-relative. */
  offsetLeft?: string;
  /** Rendered width of the flash's bounding box, e.g. "260px" or "20vw". */
  width?: string;
  /** Rendered height of the flash's bounding box, e.g. "368px" or "28.28vw". */
  height?: string;
  /** Rotation in degrees applied to the flash graphic AND its mask together. Default 0. */
  rotate?: number;
  /** Uniform scale applied to the flash graphic AND its mask together. Default 1. */
  scale?: number;
  /** Extra classes for the outer wrapping container (e.g. min-h-[...]). */
  wrapperClassName?: string;
  /**
   * Color used for the inverting layer. difference(color, black) = color
   * exactly, so wherever the flash crosses black text, the letters will
   * render in exactly this color. Default white.
   */
  overlayColor?: string;
  /**
   * Width of a solid, NON-blended outline drawn around the inverted
   * letters, in the same overlayColor, to cover the sub-pixel anti-
   * aliasing seam mix-blend-mode: difference leaves at glyph edges.
   * Default "0.6px". Set to "0px" to disable.
   */
  strokeWidth?: string;
  /** Draws a dashed border around the container and the flash's bounding
   * box to help you see the layout while tuning offset/rotate/scale. */
  debug?: boolean;
};

// Geometry copied directly from /public/flash.svg (viewBox 0 0 842 1191).
// Update these three constants if you ever replace the source file.
const FLASH_PATH_D =
  "M16.946,1040.201l442.27,-358.429l-224.3,-133.224l407.677,-398.197l175.881,150.846l-299.21,259.685l305.68,130.985l-808,348.334l0.001,0.001Z";
const FLASH_VIEWBOX_W = 842;
const FLASH_VIEWBOX_H = 1191;
const FLASH_FILL = "#56fd8d";

/**
 * Builds ONE image source used for BOTH the visible <img> and the mask.
 * This is the key fix: previously the visible image rotated via a CSS
 * transform on its already-stretched box (rotate AFTER scale), while the
 * mask rotated the shape inside its native 842x1191 coordinates (rotate
 * BEFORE scale). Those two orders only match when the stretch is exactly
 * uniform in x and y, which vw-based sizing rarely hits exactly — hence
 * the diagonal drift you saw. Baking rotate/scale into ONE shared source
 * means both the <img> and the mask stretch the identical already-rotated
 * artwork, so they can't drift apart regardless of the final box size.
 */
function buildFlashSrc(fallbackSrc: string, rotate: number, scale: number): string {
  if (rotate === 0 && scale === 1) {
    return fallbackSrc;
  }
  const cx = FLASH_VIEWBOX_W / 2;
  const cy = FLASH_VIEWBOX_H / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FLASH_VIEWBOX_W} ${FLASH_VIEWBOX_H}" preserveAspectRatio="none">
    <g transform="translate(${cx},${cy}) rotate(${rotate}) scale(${scale}) translate(${-cx},${-cy})">
      <path d="${FLASH_PATH_D}" fill="${FLASH_FILL}" />
    </g>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function FlashTextEffect({
  children,
  as: Tag = "h1" as ElementType,
  className = "",
  maskImage = "/flash.svg",
  offsetTop = "0px",
  offsetLeft = "0px",
  width = "260px",
  height = "368px",
  rotate = 0,
  scale = 1,
  wrapperClassName = "",
  overlayColor = "#ffffff",
  strokeWidth = "0.6px",
  debug = false,
}: FlashTextEffectProps) {
  const flashSrc = buildFlashSrc(maskImage, rotate, scale);

  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url("${flashSrc}")`,
    maskImage: `url("${flashSrc}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: `left ${offsetLeft} top ${offsetTop}`,
    maskPosition: `left ${offsetLeft} top ${offsetTop}`,
    WebkitMaskSize: `${width} ${height}`,
    maskSize: `${width} ${height}`,
  };

  return (
    <div
      className={`relative isolate ${wrapperClassName}`}
      style={debug ? { outline: "1px dashed red" } : undefined}
    >
      {/* Layer 1 — the flash graphic, shown in its real SVG colors. Not
          masked. Uses the SAME flashSrc as the mask below — no separate
          CSS transform, since rotation/scale are already baked in. */}
      <img
        src={flashSrc}
        alt=""
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{
          top: offsetTop,
          left: offsetLeft,
          width,
          height,
          maxWidth: "none",
          outline: debug ? "1px dashed dodgerblue" : undefined,
        }}
      />

      {/* Layer 2 — the real, accessible heading, in its normal color */}
      <Tag className={`relative ${className}`}>{children}</Tag>

      {/* Layer 3 — invisible duplicate, masked to the flash shape, blended
          with difference to invert whatever color the real letter is. */}
      <Tag
        aria-hidden
        className={`absolute inset-0 select-none ${className}`}
        style={{
          color: overlayColor,
          mixBlendMode: "difference",
          ...maskStyle,
        }}
      >
        {children}
      </Tag>

      {/* Layer 4 — a solid, NORMALLY-blended outline in overlayColor,
          masked the same way. Not run through difference, so it can't
          invert twice — it just paints the correct final color directly
          over the anti-aliasing seam left by Layer 3. */}
      {strokeWidth !== "0px" && (
        <Tag
          aria-hidden
          className={`absolute inset-0 select-none ${className}`}
          style={{
            color: "transparent",
            WebkitTextStroke: `${strokeWidth} ${overlayColor}`,
            ...maskStyle,
          }}
        >
          {children}
        </Tag>
      )}
    </div>
  );
}