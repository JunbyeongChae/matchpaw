interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-muted rounded-card ${className}`} />
  );
}

export function AnimalCardSkeleton() {
  return (
    <div
      className="bg-surface-card rounded-card overflow-hidden"
      style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
    >
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-12 rounded-pill" />
        </div>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

export function ChecklistSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
