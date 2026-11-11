"use client";

import { useEffect, useRef, useState } from "react";

interface AutoVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * A silent looping clip that downloads and plays only while it is on screen. With reduced motion, data saver
 * or a slow connection it never loads the video and just shows the poster.
 */
export function AutoVideo({ src, poster, className = "" }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const blocked = window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
    setEnabled(!blocked);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!enabled || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.getAttribute("src")) video.src = src;
        void video.play().catch(() => undefined);
      } else video.pause();
    }, { rootMargin: "120px", threshold: 0.15 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [enabled, src]);

  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />;
}
