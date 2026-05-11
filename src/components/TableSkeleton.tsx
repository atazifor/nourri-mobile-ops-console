interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-md border border-border px-3 py-3"
        >
          <div className="h-8 w-8 animate-pulse rounded-full bg-canvas-muted" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-40 animate-pulse rounded bg-canvas-muted" />
            <div className="h-2.5 w-56 animate-pulse rounded bg-canvas-muted/70" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-canvas-muted" />
        </div>
      ))}
    </div>
  );
}
