"use client";

import { useLayoutEffect, useRef, useState } from "react";

const DURATION_MS = 800;

/** Shows the final number in the HTML, then counts up from 0 once it scrolls into view. */
interface CountUpProps {
  value: number;
  className?: string;
  /** Divides the value for display, e.g. 1000 shows 10000 as 10. */
  divisor?: number;
  maximumFractionDigits?: number;
  suffix?: string;
}

export function CountUp({ value, className, divisor = 1, maximumFractionDigits = 0, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useLayoutEffect(() => {
    setShown(value);
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches || value <= 0) return;

    let frame = 0;
    setShown(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        setShown(Math.round(value * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const format = (number: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(number / divisor)}${suffix}`;

  return <span ref={ref} className={className} aria-label={format(value)}>{format(shown)}</span>;
}
