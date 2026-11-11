"use client";

import { useEffect } from "react";

const TARGETS = "a.btn-sheen, button.press";

/** One listener for the whole page: a soft ripple spreads from the press point on primary buttons and tabs. */
export function RippleEffect() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(TARGETS);
      if (!target || target.matches(":disabled")) return;

      const rect = target.getBoundingClientRect();
      const radius = Math.hypot(rect.width, rect.height);
      if (getComputedStyle(target).position === "static") target.style.position = "relative";

      const layer = document.createElement("span");
      layer.className = "ripple-layer";
      layer.setAttribute("aria-hidden", "true");
      const dot = document.createElement("span");
      dot.className = "ripple-dot";
      dot.style.cssText = `width:${radius * 2}px;height:${radius * 2}px;left:${event.clientX - rect.left - radius}px;top:${event.clientY - rect.top - radius}px`;
      layer.append(dot);
      target.append(layer);
      dot.addEventListener("animationend", () => layer.remove(), { once: true });
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
