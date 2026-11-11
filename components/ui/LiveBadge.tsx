/** Red pulsing "LIVE" tag for events that are running now. */
export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-red-300 ring-1 ring-red-400/50">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-red-500 opacity-70 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-red-500" />
      </span>
      LIVE
    </span>
  );
}
