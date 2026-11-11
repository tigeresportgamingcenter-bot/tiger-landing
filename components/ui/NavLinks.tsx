"use client";

import { sectionIdFromHref } from "@/lib/sections";
import { useActiveSection } from "@/components/ui/useActiveSection";
import type { NavigationItem } from "@/types";

/** Desktop nav links; the link of the section being read stays highlighted. */
export function NavLinks({ navigation }: { navigation: NavigationItem[] }) {
  const active = useActiveSection(navigation.map((item) => sectionIdFromHref(item.href)));

  return (
    <>
      {navigation.map((item) => {
        const isActive = active === sectionIdFromHref(item.href);
        return (
          <a key={item.href} href={item.href} aria-current={isActive ? "location" : undefined} className={`link-underline text-sm font-semibold transition hover:text-accent ${isActive ? "nav-active" : "text-zinc-300"}`}>
            {item.label}
          </a>
        );
      })}
    </>
  );
}
