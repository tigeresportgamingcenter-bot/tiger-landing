"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SHOW_NEAR_TOP_PX = 80;
const MIN_DELTA_PX = 6;

/** Sticky header that slides away while scrolling down and returns on scroll up, focus or an open menu. */
export function HeaderHideOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const keepOpen = Boolean(ref.current?.matches(":focus-within") || ref.current?.querySelector("details[open]"));
      if (y < SHOW_NEAR_TOP_PX || keepOpen) setHidden(false);
      else if (y - lastY > MIN_DELTA_PX) setHidden(true);
      else if (lastY - y > MIN_DELTA_PX) setHidden(false);
      if (Math.abs(y - lastY) > MIN_DELTA_PX) lastY = y;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header ref={ref} data-hidden={hidden} onFocusCapture={() => setHidden(false)} className={className}>{children}</header>;
}
