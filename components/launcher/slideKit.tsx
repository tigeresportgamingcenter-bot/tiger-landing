"use client";

import { useEffect, useState } from "react";
import type { Promotion, TournamentEvent, TournamentStatus } from "@/types";
import type { LauncherData, SlideKey } from "./launcherTypes";

/** How long one item (a promotion, a tournament) stays on screen inside a slide. */
export const ITEM_MS = 7_000;
export const MIN_DWELL_MS = 14_000;

export const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
/** Prize pools are free text in the CMS; a bare number becomes money. */
export const prizeText = (value: string) => (/^\d+$/.test(value.trim()) ? money(Number(value)) : value);
export const shortDate = (value: string | null) => (value ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value)) : null);
export const statusLabels: Record<TournamentStatus, string> = { registration_open: "Đang mở đăng ký", ongoing: "Đang diễn ra", upcoming: "Sắp diễn ra", completed: "Đã kết thúc" };

export function eventWhen(event: TournamentEvent) {
  if (!event.startsAt) return shortDate(event.heldOn) ?? "Lịch đang cập nhật";
  const parts = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Ho_Chi_Minh" }).formatToParts(new Date(event.startsAt));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("hour")}:${part("minute")} · ${part("weekday")}, ${part("day")}/${part("month")}`;
}

export const pickPromotions = (data: LauncherData): Promotion[] => [...data.promotions].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4);

export function itemCount(key: SlideKey, data: LauncherData) {
  if (key === "promotions") return pickPromotions(data).length;
  if (key === "tournaments") return data.events.length;
  if (key === "results") return data.completedEvents.length;
  return 0;
}

export function hasContent(key: SlideKey, data: LauncherData) {
  if (key === "ranking") return data.leaderboard.length > 0 || data.members.length > 0;
  if (key === "complaint") return true;
  return itemCount(key, data) > 0;
}

export function dwellMs(key: SlideKey, data: LauncherData) {
  return Math.max(MIN_DWELL_MS, itemCount(key, data) * ITEM_MS);
}

/** Steps through `count` items on a timer; restarts at the first item each time the slide mounts. */
export function useCycle(count: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % count), ITEM_MS);
    return () => clearInterval(id);
  }, [count]);
  return count ? index % count : 0;
}

/** Entrance stagger: pass the step number, the CSS turns it into a delay. */
export const rise = (step: number) => ({ "--d": `${step * 80}ms` }) as React.CSSProperties;

export function SlideTitle({ children, aside }: { children: string; aside?: string }) {
  return (
    <div className="rise flex items-end justify-between gap-8" style={rise(0)}>
      <h2 className="font-display text-[4.5rem] uppercase text-white">{children}</h2>
      {aside ? <p className="pb-2 text-[1.75rem] font-semibold text-zinc-300">{aside}</p> : null}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="grid h-full place-items-center bg-panel p-12 text-center text-[2.5rem] font-bold text-zinc-300">{text}</p>;
}

/** The row of small tiles showing every item in a slide, with the current one filled. */
export function Pager({ labels, active }: { labels: string[]; active: number }) {
  if (labels.length < 2) return null;
  return (
    <ol className="flex gap-3" aria-label="Các mục trong bảng tin">
      {labels.map((label, index) => (
        <li key={`${label}-${index}`} className={`min-w-0 flex-1 truncate px-5 py-3 text-[1.375rem] font-bold transition-colors duration-500 ${index === active ? "bg-accent text-ground" : "bg-panel text-zinc-300"}`}>{label}</li>
      ))}
    </ol>
  );
}
