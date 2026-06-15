interface SurveyProgressProps {
  current: number;
  total: number;
}

export default function SurveyProgress({ current, total }: SurveyProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[12px] text-text-muted">
          {current + 1} / {total}
        </span>
        <span className="font-mono text-[12px] text-text-brand font-medium">
          {Math.round(((current + 1) / total) * 100)}%
        </span>
      </div>
      <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
