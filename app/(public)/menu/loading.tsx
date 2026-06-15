export default function MenuLoading() {
  return (
    <div className="section">
      <div className="container-base">
        {/* Heading skeleton */}
        <div className="h-8 w-32 bg-ink-faint rounded animate-pulse" />
        <div className="mt-2 h-4 w-24 bg-ink-faint/60 rounded animate-pulse" />

        {/* Search skeleton */}
        <div className="mt-8 h-10 max-w-md bg-ink-faint/60 rounded animate-pulse" />

        {/* Category pills */}
        <div className="mt-5 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-ink-faint/60 animate-pulse" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-44 w-full bg-ink-faint/50 animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-ink-faint/60 rounded animate-pulse" />
                <div className="h-3 w-full  bg-ink-faint/40 rounded animate-pulse" />
                <div className="h-3 w-2/3  bg-ink-faint/40 rounded animate-pulse" />
                <div className="flex justify-between items-center mt-2">
                  <div className="h-5 w-16 bg-ink-faint/60 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-ink-faint/60 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
