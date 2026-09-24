"use client";

import { useEffect, useMemo, useState } from "react";

export type NavLink = { href: string; label: string };

/** Skew angle for the nav parallelograms, in degrees. This one number is the "parameter". */
const NAV_SKEW_DEG = 14;

/** Tracks which section is currently centred in the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // If more than one section is technically visible, prefer whichever is closest to the top.
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(topMost.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // ids is derived from `links` with useMemo in the caller, so it's stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}

/**
 * Header nav rendered as a connected strip of parallelogram tabs.
 * The tab matching the section in view grows and turns white; the rest
 * stay small and purple. Skew angle is a parameter (`skewDeg`), defaulting
 * to NAV_SKEW_DEG above.
 */
export default function NavTabs({
  links,
  skewDeg = NAV_SKEW_DEG,
}: {
  links: NavLink[];
  skewDeg?: number;
}) {
  const sectionIds = useMemo(() => links.map((link) => link.href.slice(1)), [links]);
  const activeId = useActiveSection(sectionIds);

  return (
    <nav className="hidden items-stretch sm:flex" aria-label="Section navigation">
      {links.map((link, i) => {
        const id = link.href.slice(1);
        const active = id === activeId;
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={active ? "true" : undefined}
            className="relative flex items-center justify-center whitespace-nowrap border border-black/10 text-[11px] font-semibold uppercase tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-110"
            style={{
              transform: `skewX(-${skewDeg}deg)`,
              marginLeft: i === 0 ? 0 : "-1px",
              height: active ? 44 : 32,
              minWidth: active ? 128 : 84,
              padding: "0 16px",
              backgroundColor: active ? "#ffffff" : "#660066",
              color: active ? "#14181C" : "#ede9fe",
              boxShadow: active ? "0 6px 16px -6px rgba(0,0,0,0.35)" : "none",
              zIndex: active ? 10 : 1,
            }}
          >
            {/* counter-skew so the label stays upright inside the parallelogram */}
            <span className="block" style={{ transform: `skewX(${skewDeg}deg)` }}>
              {link.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}