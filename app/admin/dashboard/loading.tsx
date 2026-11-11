/** Shown at once while a section loads, so a click never looks like nothing happened. */
export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-ground px-4 pb-16 pt-6 sm:px-6" aria-busy="true">
      <p className="sr-only" role="status">Đang tải...</p>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4">
          <div className="size-10 shimmer rounded-lg bg-panel" />
          <div className="grid gap-2">
            <div className="h-3 w-32 shimmer rounded bg-panel" />
            <div className="h-9 w-64 shimmer rounded bg-panel" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden h-96 shimmer rounded-xl bg-panel lg:block" />
          <div className="grid gap-3">
            <div className="h-12 shimmer rounded-lg bg-panel" />
            <div className="h-24 shimmer rounded-xl bg-panel" />
            <div className="h-24 shimmer rounded-xl bg-panel" />
            <div className="h-24 shimmer rounded-xl bg-panel" />
          </div>
        </div>
      </div>
    </main>
  );
}
