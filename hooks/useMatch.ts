import { useMutation } from '@tanstack/react-query';
import { useMatchStore } from '@/store/matchStore';
import type { SurveyAnswers } from '@/types/survey';
import type { MatchResult } from '@/types/match';

export function useMatch() {
  const setResult = useMatchStore((s) => s.setResult);

  return useMutation<MatchResult, Error, SurveyAnswers>({
    mutationFn: async (surveyAnswers) => {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyAnswers, numOfRows: 20 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error.message);
      return data.data;
    },
    onSuccess: (data) => setResult(data),
  });
}
