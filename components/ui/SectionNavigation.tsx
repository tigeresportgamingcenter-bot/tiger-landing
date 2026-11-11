"use client";

import { useEffect, useState } from "react";
import type { NavigationItem } from "@/types";

export function SectionNavigation({ navigation }: { navigation: NavigationItem[] }) {
  const [activeHref, setActiveHref] = useState<string>("");

  useEffect(() => {
    const ids = navigation.map((item) => item.href).filter((href) => href.startsWith("#"));
    const sections = ids.map((id) => document.getElementById(id.slice(1))).filter((element): element is HTMLElement => Boolean(element));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (intersecting[0]) setActiveHref(`#${intersecting[0].target.id}`);
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navigation]);

  return (
    <nav className="hidden items-center gap-6 lg:flex" aria-label="Điều hướng chính">
      {navigation.map((item) => (
        <a key={item.href} href={item.href} aria-current={activeHref === item.href ? "location" : undefined}
          className={`relative text-sm font-semibold transition-colors duration-200 hover:text-accent after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300 ${activeHref === item.href ? "text-accent after:scale-x-100" : "text-zinc-300 after:scale-x-0"}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
