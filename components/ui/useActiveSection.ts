"use client";

import { useEffect, useState } from "react";

const ACTIVE_LINE = 0.35;

/** The section whose top has passed 35% of the viewport; null near the top of the page. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const targets = key
      .split("|")
      .map((id) => ({ id, node: document.getElementById(id) }))
      .filter((target): target is { id: string; node: HTMLElement } => target.node !== null);
    let ticking = false;

    const update = () => {
      ticking = false;
      const line = window.innerHeight * ACTIVE_LINE;
      let current: string | null = null;
      let best = -Infinity;
      for (const { id, node } of targets) {
        const top = node.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key]);

  return active;
}
