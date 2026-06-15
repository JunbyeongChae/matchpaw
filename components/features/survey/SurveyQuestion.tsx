interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SurveyQuestionProps {
  question: string;
  options: Option[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

export default function SurveyQuestion({
  question,
  options,
  selected,
  onSelect,
}: SurveyQuestionProps) {
  return (
    <div className="space-y-5">
      <h2 className="font-mono font-medium text-[20px] leading-8 text-text-primary">
        {question}
      </h2>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left p-4 rounded-card border-2 transition-all duration-150 ${
                isSelected
                  ? 'border-brand-primary bg-surface-hero'
                  : 'border-border-default bg-surface-card hover:border-brand-secondary hover:bg-surface-warm'
              }`}
            >
              <p
                className={`font-mono font-medium text-[15px] ${
                  isSelected ? 'text-text-brand' : 'text-text-primary'
                }`}
              >
                {opt.label}
              </p>
              {opt.description && (
                <p className="font-mono text-[12px] text-text-muted mt-1">
                  {opt.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
