import type { CSSProperties } from "react";
import { formatNumbersInText } from "@/lib/formatText";

export function HighlightList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={item} style={{ "--i": index } as CSSProperties} className="card-lift stagger-item flex items-start gap-4 rounded-2xl bg-black/35 p-5 text-base leading-7 text-zinc-200 ring-1 ring-white/10">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-sm font-extrabold tabular-nums text-accent ring-1 ring-accent/40" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span>{formatNumbersInText(item)}</span>
        </li>
      ))}
    </ul>
  );
}
