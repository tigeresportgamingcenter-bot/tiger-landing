/** Shown while a tournament page loads, so a click never looks like nothing happened. */
export default function TournamentLoading() {
  return (
    <main className="min-h-screen bg-ground px-4 pb-16 pt-24 sm:px-6" aria-busy="true">
      <p className="sr-only" role="status">Đang tải...</p>
      <div className="mx-auto grid max-w-5xl gap-4">
        <div className="shimmer h-4 w-28 rounded bg-panel" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="shimmer h-28 rounded-xl bg-panel" />
          <div className="shimmer h-28 rounded-xl bg-panel" />
          <div className="shimmer h-28 rounded-xl bg-panel" />
          <div className="shimmer h-28 rounded-xl bg-panel" />
        </div>
        <div className="shimmer h-14 w-3/4 rounded-lg bg-panel" />
        <div className="shimmer aspect-[16/7] rounded-lg bg-panel" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="shimmer h-20 rounded-lg bg-panel" />
          <div className="shimmer h-20 rounded-lg bg-panel" />
          <div className="shimmer h-20 rounded-lg bg-panel" />
        </div>
      </div>
    </main>
  );
}
