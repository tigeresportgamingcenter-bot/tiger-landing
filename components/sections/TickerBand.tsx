const MIN_ITEMS_PER_GROUP = 8;

/** A slow band of short facts under the hero. The text comes from the site data; it pauses on hover. */
export function TickerBand({ items }: { items: string[] }) {
  const clean = items.map((item) => item.trim()).filter(Boolean);
  if (!clean.length) return null;
  const group = Array.from({ length: Math.max(MIN_ITEMS_PER_GROUP, clean.length) }, (_, index) => clean[index % clean.length]);

  return (
    <div className="ticker overflow-hidden border-y border-white/10 bg-panel py-4" aria-label="Điểm nổi bật của Tiger">
      <div className="ticker-track">
        {[false, true].map((hidden) => (
          <ul key={String(hidden)} aria-hidden={hidden || undefined} className="ticker-group flex shrink-0 items-center">
            {group.map((item, index) => (
              <li key={index} className="flex items-center whitespace-nowrap text-lg font-extrabold uppercase tracking-wide text-zinc-200">
                {item}
                <span className="mx-8 size-2 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
