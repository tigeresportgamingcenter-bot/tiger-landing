"use client";

import { sectionIdFromHref } from "@/lib/sections";
import { useActiveSection } from "@/components/ui/useActiveSection";
import type { NavigationItem } from "@/types";

/** Dots down the right edge of wide screens: one per section, the one being read is stretched. */
export function SectionDots({ navigation }: { navigation: NavigationItem[] }) {
  const active = useActiveSection(navigation.map((item) => sectionIdFromHref(item.href)));

  return (
    <nav aria-label="Các mục trên trang" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <ul className="grid gap-3">
        {navigation.map((item) => {
          const isActive = active === sectionIdFromHref(item.href);
          return (
            <li key={item.href} className="group relative flex justify-end">
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-md bg-ground/90 px-2.5 py-1 text-xs font-bold text-white opacity-0 ring-1 ring-white/10 transition duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">{item.label}</span>
              <a href={item.href} aria-label={item.label} aria-current={isActive ? "location" : undefined} className="grid size-5 place-items-center">
                <span className={`block rounded-full transition-all duration-300 ${isActive ? "h-6 w-2 bg-accent shadow-[0_0_12px_rgb(180_77_255/0.9)]" : "size-2 bg-white/35 group-hover:bg-white/70"}`} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
