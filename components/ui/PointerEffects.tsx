"use client";

import { useEffect } from "react";

const TILT_DEG = 8;
const MAGNET_PULL = 0.18;
const MAGNET_MAX_PX = 8;

/**
 * One pointer listener for the whole page, only on devices with a mouse:
 * - cards (.card-lift) get a purple spotlight that follows the cursor,
 * - cards marked .card-tilt also lean towards it,
 * - buttons marked .magnetic drift a few pixels towards it.
 * Elements only need the class; their look is in globals.css.
 */
export function PointerEffects() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let event: PointerEvent | null = null;
    let card: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const resetCard = (node: HTMLElement | null) => {
      node?.style.removeProperty("--tx");
      node?.style.removeProperty("--ty");
    };
    const resetMagnet = (node: HTMLElement | null) => {
      node?.style.removeProperty("--mag-x");
      node?.style.removeProperty("--mag-y");
    };

    const update = () => {
      frame = 0;
      if (!event) return;
      const target = event.target as Element | null;
      const nextCard = target?.closest<HTMLElement>(".card-lift") ?? null;
      const nextMagnet = target?.closest<HTMLElement>(".magnetic") ?? null;

      if (card !== nextCard) { resetCard(card); card = nextCard; }
      if (magnet !== nextMagnet) { resetMagnet(magnet); magnet = nextMagnet; }

      if (card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        if (!reduce.matches && card.classList.contains("card-tilt")) {
          card.style.setProperty("--tx", `${(-(y / rect.height - 0.5) * TILT_DEG).toFixed(2)}deg`);
          card.style.setProperty("--ty", `${((x / rect.width - 0.5) * TILT_DEG).toFixed(2)}deg`);
        }
      }
      if (magnet && !reduce.matches) {
        const rect = magnet.getBoundingClientRect();
        const clamp = (value: number) => Math.max(-MAGNET_MAX_PX, Math.min(MAGNET_MAX_PX, value));
        magnet.style.setProperty("--mag-x", `${clamp((event.clientX - (rect.left + rect.width / 2)) * MAGNET_PULL).toFixed(1)}px`);
        magnet.style.setProperty("--mag-y", `${clamp((event.clientY - (rect.top + rect.height / 2)) * MAGNET_PULL).toFixed(1)}px`);
      }
    };
    const onMove = (next: PointerEvent) => {
      event = next;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      resetCard(card);
      resetMagnet(magnet);
      card = null;
      magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
