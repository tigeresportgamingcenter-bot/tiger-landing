"use client";

import { useRef } from "react";
import type { NavigationItem } from "@/types";

export function MobileMenu({ navigation }: { navigation: NavigationItem[] }) {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={menu} className="relative lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center rounded-lg bg-white/10 px-4 text-sm font-bold text-white">Menu</summary>
      <nav className="menu-panel absolute right-0 top-14 grid w-56 gap-1 rounded-xl bg-panel p-2" aria-label="Điều hướng mobile">
        {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => menu.current?.removeAttribute("open")} className="flex min-h-12 items-center rounded-lg px-4 text-base font-semibold text-zinc-200 hover:bg-white/10">{item.label}</a>)}
      </nav>
    </details>
  );
}
