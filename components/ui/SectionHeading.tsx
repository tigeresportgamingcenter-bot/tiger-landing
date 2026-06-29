"use client";

import { useEffect, useRef, useState } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-reveal ${visible ? "is-visible" : ""} ${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-tiger-orange">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-4 leading-7 text-zinc-400">{description}</p> : null}
    </div>
  );
}
