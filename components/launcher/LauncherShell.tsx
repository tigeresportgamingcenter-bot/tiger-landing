"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ComplaintSlide } from "./ComplaintSlide";
import { PromotionsSlide } from "./PromotionsSlide";
import { RankingSlide } from "./RankingSlide";
import { ResultsSlide } from "./ResultsSlide";
import { TournamentsSlide } from "./TournamentsSlide";
import { dwellMs, hasContent } from "./slideKit";
import type { LauncherData, SlideKey } from "./launcherTypes";

declare global {
  interface Window {
    /** Present only inside the Tiger desktop launcher (Electron preload). */
    tigerLauncher?: { close: () => void };
  }
}

const MANUAL_MS = 60_000;
const REFRESH_MS = 5 * 60_000;

const allTabs: Array<{ key: SlideKey; label: string }> = [
  { key: "promotions", label: "Ưu đãi" },
  { key: "tournaments", label: "Giải đấu" },
  { key: "results", label: "Tổng kết giải" },
  { key: "ranking", label: "Xếp hạng" },
  { key: "complaint", label: "Khiếu nại" },
];

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("vi-VN", { ...options, timeZone: "Asia/Ho_Chi_Minh" }).format(now);
  return (
    <time className="text-right leading-none" dateTime={now.toISOString()}>
      <span className="block text-[3rem] font-extrabold text-white tabular-nums">{format({ hour: "2-digit", minute: "2-digit" })}</span>
      <span className="mt-1 block text-[1.25rem] font-semibold text-zinc-300">{format({ weekday: "long", day: "2-digit", month: "2-digit" })}</span>
    </time>
  );
}

export function LauncherShell({ data }: { data: LauncherData }) {
  const router = useRouter();
  const tabs = useMemo(() => allTabs.filter((tab) => hasContent(tab.key, data)), [data]);
  const [index, setIndex] = useState(0);
  const [rankingCycle, setRankingCycle] = useState(0);
  const [manual, setManual] = useState(false);
  const [tick, setTick] = useState(0);
  const [inApp, setInApp] = useState(false);
  const current = tabs[index % tabs.length];
  const holdMs = manual ? MANUAL_MS : dwellMs(current.key, data);

  useEffect(() => setInApp(Boolean(window.tigerLauncher)), []);

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((value) => (value + 1) % tabs.length);
      setManual(false);
      setTick((value) => value + 1);
    }, holdMs);
    return () => clearTimeout(id);
  }, [index, holdMs, tick, tabs.length]);

  useEffect(() => {
    if (current.key === "ranking") setRankingCycle((value) => value + 1);
  }, [current.key]);

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  const choose = (next: number) => {
    setIndex(next);
    setManual(true);
    setTick((value) => value + 1);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-ground px-[3.5rem]">
      <header className="flex items-center justify-between gap-8 pb-3 pt-7">
        <div className="flex items-center gap-5">
          <span className="grid size-[4.25rem] place-items-center bg-accent font-display text-[3rem] text-ground" aria-hidden="true">T</span>
          <div>
            <p className="font-display text-[3rem] uppercase text-white">Tiger Esports</p>
            <p className="text-[1.375rem] font-bold text-accent">Gaming Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <p className="text-right text-[1.375rem] font-semibold leading-tight text-zinc-300">Hotline<span className="block text-[2rem] font-extrabold text-white tabular-nums">{data.hotline}</span></p>
          <Clock />
          {inApp ? <button type="button" onClick={() => window.tigerLauncher?.close()} className="press min-h-[4.25rem] bg-white px-9 text-[1.875rem] font-extrabold text-ground transition-colors hover:bg-accent">Vào chơi</button> : null}
        </div>
      </header>
      <main key={current.key} className="min-h-0 flex-1 overflow-hidden py-3">
        {current.key === "promotions" ? <PromotionsSlide data={data} /> : null}
        {current.key === "tournaments" ? <TournamentsSlide data={data} /> : null}
        {current.key === "results" ? <ResultsSlide data={data} /> : null}
        {current.key === "ranking" ? <RankingSlide data={data} cycle={rankingCycle} /> : null}
        {current.key === "complaint" ? <ComplaintSlide data={data} /> : null}
      </main>
      <nav aria-label="Mục thông tin" className="flex gap-3 pb-7 pt-3">
        {tabs.map((tab, tabIndex) => {
          const active = tab.key === current.key;
          return (
            <button key={tab.key} type="button" onClick={() => choose(tabIndex)} aria-current={active} className={`press relative flex-1 overflow-hidden px-6 py-[1.375rem] text-[2rem] font-extrabold transition-colors ${active ? "bg-accent text-ground" : "bg-panel text-white hover:bg-white/15"}`}>
              {active ? <span key={`${index}-${tick}`} className="launcher-progress absolute inset-0 bg-ground/25" style={{ animationDuration: `${holdMs}ms` }} aria-hidden="true" /> : null}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
