import fs from "fs";
import path from "path";

export type SponsorLogo = {
  src: string;
  alt: string;
};

function SponsorMarquee({
  logos,
  lines = 2,
  speed = 32,
}: {
  logos: SponsorLogo[];
  lines?: number;
  speed?: number;
}) {
  const rows = Array.from({ length: lines }, (_, index) =>
    logos.filter((_, logoIndex) => logoIndex % lines === index),
  );

  const longestRowLength = Math.max(...rows.map((row) => row.length), 1);

  return (
    <div
      className="sponsor-marquee-viewport w-full overflow-hidden"
      aria-label="Sponsors"
    >
      {rows.map((row, rowIndex) => {
        if (row.length === 0) return null;

        const items = [...row, ...row];

        const imageWidth = 21.25;
        const imageGap = 5;

        /*
         * Four images plus three 5% gaps fill the viewport exactly.
         * The duplicated track also includes the gap at the copy boundary.
         */
        const trackWidth = `${row.length * 2 * (imageWidth + imageGap)}%`;

        /*
         * Convert the visible-container dimensions above into percentages
         * of the duplicated track.
         */
        const itemWidth = `${(imageWidth / (row.length * (imageWidth + imageGap) * 2)) * 100}%`;
        const itemGap = `${(imageGap / (row.length * (imageWidth + imageGap) * 2)) * 100}%`;

        return (
          <div
            key={rowIndex}
            className="flex shrink-0 animate-[sponsor-marquee_var(--marquee-speed)_linear_infinite]"
            style={
              {
                width: trackWidth,
                gap: itemGap,

                /*
                 * Move the second row left by half a logo.
                 * One logo = 25% of the parent.
                 * Half a logo = 12.5%.
                 */
                marginLeft: rowIndex % 2 === 0 ? "0" : "-12.5%",

                /*
                 * The animation needs to move by exactly one
                 * copy of the row.
                 */
                "--marquee-speed": `${
                  (speed * row.length) / longestRowLength
                }s`,
              } as React.CSSProperties
            }
          >
            {items.map((logo, logoIndex) => (
              <div
                key={`${logo.src}-${logoIndex}`}
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: itemWidth,
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="block h-auto w-full object-contain"
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function getSponsorLogos(): SponsorLogo[] {
  const dir = path.join(process.cwd(), "public", "sponsors");

  let files: string[] = [];

  try {
    files = fs.readdirSync(dir).filter((f) =>
      [".svg", ".png", ".jpeg", ".jpg"].some((ext) =>
        f.toLowerCase().endsWith(ext),
      ),
    );
  } catch {
    return [];
  }

  return files
    .sort()
    .map((file) => ({
      src: `/sponsors/${file}`,
      alt: path
        .basename(file, path.extname(file))
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
}

export default function Sponsors() {
  const logos = getSponsorLogos();

  if (logos.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Add sponsor images to <code>public/sponsors/</code> to show them here.
      </p>
    );
  }

  return (
    <SponsorMarquee
      logos={logos}
      lines={2}
      speed={32}
    />
  );
}
