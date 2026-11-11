import { Crown, Medal, Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import { Money } from "@/components/tournament/Money";

export interface Prize {
  label: string;
  value: string;
}

const tones = [
  { ring: "ring-amber-300/50", text: "text-amber-300", glow: "from-amber-300/20" },
  { ring: "ring-zinc-300/40", text: "text-zinc-200", glow: "from-zinc-300/15" },
  { ring: "ring-orange-400/40", text: "text-orange-300", glow: "from-orange-400/15" },
] as const;

/** First prize stands tallest in the middle on wide screens, like a podium. */
export function PrizeCards({ prizes, pool }: { prizes: Prize[]; pool: string | null }) {
  return (
    <div className="mt-6 grid gap-4">
      {pool ? (
        <div className="neon-box flex flex-wrap items-center justify-between gap-3 rounded-xl bg-accent/10 px-5 py-4">
          <span className="flex items-center gap-3 text-base font-bold text-zinc-200"><Trophy className="size-5 text-accent" aria-hidden="true" />Tổng giải thưởng</span>
          <Money value={pool} className="text-3xl font-extrabold tabular-nums text-white" />
        </div>
      ) : null}
      {prizes.length ? (
        <ul className="grid items-end gap-3 sm:grid-cols-3">
          {prizes.map((prize, index) => {
            const tone = tones[Math.min(index, 2)];
            const first = index === 0;
            return (
              <li
                key={prize.label}
                style={{ "--i": index } as CSSProperties}
                className={`card-lift stagger-item rounded-2xl bg-gradient-to-b ${tone.glow} to-white/[0.03] p-5 ring-1 ${tone.ring} ${first ? "sm:order-2 sm:pb-10 sm:pt-8" : index === 1 ? "sm:order-1" : "sm:order-3"}`}
              >
                <span className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${tone.text}`}>
                  {first ? <Crown className="size-5" aria-hidden="true" /> : <Medal className="size-5" aria-hidden="true" />}{prize.label}
                </span>
                <Money value={prize.value} className={`mt-3 block font-extrabold tabular-nums text-white ${first ? "text-3xl" : "text-2xl"}`} />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
