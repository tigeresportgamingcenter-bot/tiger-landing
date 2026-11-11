"use client";

import { useEffect, useRef } from "react";
import { sectionIdFromHref, sectionPath } from "@/lib/sections";
import { useActiveSection } from "@/components/ui/useActiveSection";

/** Set to false to keep the address bar still while people scroll; it then changes only when a menu link is used. */
const SYNC_URL_ON_SCROLL = true;
const SETTLE_MS = 1500;

/**
 * Gives home-page sections clean URLs such as /bang-gia. Opening one scrolls to its section, menu links scroll
 * smoothly without reloading, and old /#bang-gia links are rewritten to the clean form.
 */
export function SectionRouter({ ids }: { ids: string[] }) {
  const active = useActiveSection(ids);
  const ready = useRef(false);
  const scrolling = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);
  const idsKey = ids.join("|");

  useEffect(() => {
    const known = new Set(idsKey.split("|"));

    const scrollToSection = (id: string, behavior: ScrollBehavior) => {
      window.clearTimeout(settleTimer.current);
      scrolling.current = behavior === "smooth";
      if (scrolling.current) settleTimer.current = window.setTimeout(() => { scrolling.current = false; }, SETTLE_MS);
      const node = id ? document.getElementById(id) : null;
      if (node) node.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
    };

    const idFor = (url: URL): string | null => {
      if (url.pathname === "/") {
        if (!url.hash) return "";
        const id = sectionIdFromHref(url.hash);
        return known.has(id) || id === "" ? id : null;
      }
      const id = url.pathname.replace(/^\/|\/$/g, "");
      return known.has(id) ? id : null;
    };

    const initial = idFor(new URL(window.location.href));
    if (initial !== null && (initial || window.location.hash)) {
      window.history.scrollRestoration = "manual";
      if (window.location.hash) window.history.replaceState(null, "", sectionPath(initial));
      scrollToSection(initial, "instant");
      requestAnimationFrame(() => scrollToSection(initial, "instant"));
    }
    const readyTimer = window.setTimeout(() => { ready.current = true; }, 400);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const id = idFor(url);
      if (id === null) return;
      event.preventDefault();
      if (window.location.pathname !== sectionPath(id)) window.history.pushState(null, "", sectionPath(id));
      scrollToSection(id, "smooth");
    };
    const onPop = () => {
      const id = idFor(new URL(window.location.href));
      if (id !== null) scrollToSection(id, "smooth");
    };
    const onScrollEnd = () => { scrolling.current = false; };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(settleTimer.current);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [idsKey]);

  useEffect(() => {
    if (!SYNC_URL_ON_SCROLL || !ready.current || scrolling.current) return;
    const path = sectionPath(active ?? "");
    if (window.location.pathname !== path) window.history.replaceState(null, "", path);
  }, [active]);

  return null;
}
