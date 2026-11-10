"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TigerMark } from "@/components/ui/TigerMark";
import { ComplaintSlide, PromotionsSlide, RankingSlide, ResultsSlide, TournamentsSlide } from "./LauncherSlides";
import type { LauncherData, SlideKey } from "./launcherTypes";

declare global {
  interface Window {
    /** Present only inside the Tiger desktop launcher (Electron preload). */
    tigerLauncher?: { close: () => void };
  }
}

const AUTO_MS = 18_000;
const MANUAL_MS = 60_000;
const REFRESH_MS = 5 * 60_000;

const tabs: Array<{ key: SlideKey; label: string }> = [
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
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return <time className="text-3xl font-bold tabular-nums text-white" dateTime={now.toISOString()}>{new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(now)}</time>;
}

export function LauncherShell({ data }: { data: LauncherData }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [rankingCycle, setRankingCycle] = useState(0);
  const [holdMs, setHoldMs] = useState(AUTO_MS);
  const [tick, setTick] = useState(0);
  const [inApp, setInApp] = useState(false);
  const active = tabs[index].key;

  useEffect(() => setInApp(Boolean(window.tigerLauncher)), []);

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((current) => (current + 1) % tabs.length);
      setHoldMs(AUTO_MS);
      setTick((value) => value + 1);
    }, holdMs);
    return () => clearTimeout(id);
  }, [index, holdMs, tick]);

  useEffect(() => {
    if (active === "ranking") setRankingCycle((value) => value + 1);
  }, [active]);

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  const choose = (next: number) => {
    setIndex(next);
    setHoldMs(MANUAL_MS);
    setTick((value) => value + 1);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-ground p-8 pb-6">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <TigerMark />
          <div><p className="font-display text-4xl uppercase text-white">{data.brandName}</p><p className="text-lg font-semibold text-accent">Gaming Hub</p></div>
        </div>
        <div className="flex items-center gap-8">
          <p className="text-2xl text-zinc-200">Hotline <b className="text-white tabular-nums">{data.hotline}</b></p>
          <Clock />
          {inApp ? <button type="button" onClick={() => window.tigerLauncher?.close()} className="press min-h-12 rounded-xl bg-white px-6 text-2xl font-extrabold text-ground transition hover:bg-accent">Vào chơi</button> : null}
        </div>
      </header>
      <div className="mt-6 flex min-h-0 flex-1 gap-8">
        <nav aria-label="Mục thông tin" className="flex w-60 shrink-0 flex-col gap-3">
          {tabs.map((tab, tabIndex) => (
            <button key={tab.key} type="button" onClick={() => choose(tabIndex)} aria-current={tabIndex === index} className={`press relative overflow-hidden rounded-xl px-5 py-5 text-left text-2xl font-bold transition ${tabIndex === index ? "neon-glow bg-accent text-ground" : "bg-panel text-white hover:bg-white/10"}`}>
              {tab.label}
              {tabIndex === index ? <span key={`${index}-${tick}`} className="launcher-progress absolute inset-x-0 bottom-0 h-1.5 bg-ground/60" style={{ animationDuration: `${holdMs}ms` }} /> : null}
            </button>
          ))}
        </nav>
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden" aria-live="off">
          {active === "promotions" ? <PromotionsSlide data={data} /> : null}
          {active === "tournaments" ? <TournamentsSlide data={data} /> : null}
          {active === "results" ? <ResultsSlide data={data} /> : null}
          {active === "ranking" ? <RankingSlide data={data} cycle={rankingCycle} /> : null}
          {active === "complaint" ? <ComplaintSlide data={data} /> : null}
        </main>
      </div>
    </div>
  );
}
