"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { key: "d", label: "Ngày", ms: 86_400_000 },
  { key: "h", label: "Giờ", ms: 3_600_000 },
  { key: "m", label: "Phút", ms: 60_000 },
  { key: "s", label: "Giây", ms: 1_000 },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** Time left until an event starts, with digits that flip as they change. Once the time has passed it shows pastLabel, or nothing. */
export function Countdown({ startsAt, large = false, pastLabel, label }: { startsAt: string | null; large?: boolean; pastLabel?: string; label?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = startsAt ? new Date(startsAt).getTime() : Number.NaN;
  if (now === null || Number.isNaN(target)) return null;
  if (target <= now) {
    return pastLabel ? <p className={`inline-flex items-center rounded-lg bg-black/50 font-bold text-zinc-100 ring-1 ring-accent/40 ${large ? "px-4 py-2 text-lg" : "px-3 py-1 text-base"}`}>{pastLabel}</p> : null;
  }

  let rest = target - now;
  const parts = UNITS.map((unit) => {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    return { ...unit, value };
  });
  const readable = `${parts[0].value} ngày ${parts[1].value} giờ ${parts[2].value} phút`;

  return (
    <div>
      {label ? <p className={`mb-2 font-semibold text-zinc-300 ${large ? "text-sm" : "text-xs"}`}>{label}</p> : null}
      <div role="timer" aria-label={`${label ?? "Còn"} ${readable}`} className="flex items-end gap-2 sm:gap-3">
      {parts.map(({ key, label, value }) => large ? (
        <div key={key} aria-hidden="true" className="flex min-w-[4.25rem] flex-col items-center rounded-lg bg-white px-3 pb-2 pt-3 text-ground shadow-[0_0_24px_rgb(180_77_255/0.25)] sm:min-w-24 sm:px-4 sm:pb-3 sm:pt-4">
          <span key={value} className="flip block text-4xl font-extrabold leading-none tabular-nums sm:text-6xl">{pad(value)}</span>
          <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 sm:text-sm">{label}</span>
        </div>
      ) : (
        <div key={key} aria-hidden="true" className="flex flex-col items-center">
          <span className="grid min-w-10 place-items-center rounded-lg bg-black/50 px-2 py-1 text-lg font-extrabold tabular-nums text-white ring-1 ring-accent/40">
            <span key={value} className="flip block">{pad(value)}</span>
          </span>
          <span className="mt-1 text-xs font-semibold text-zinc-400">{label}</span>
        </div>
      ))}
      </div>
    </div>
  );
}
