'use client';

import { useRouter } from 'next/navigation';
import { useSurveyStore } from '@/store/surveyStore';
import { useMatchStore } from '@/store/matchStore';
import SurveyProgress from '@/components/features/survey/SurveyProgress';
import SurveyQuestion from '@/components/features/survey/SurveyQuestion';
import Button from '@/components/common/Button';
import type { SurveyAnswers } from '@/types/survey';
import { useState } from 'react';

const QUESTIONS: {
  key: keyof SurveyAnswers;
  question: string;
  options: { value: string; label: string; description?: string }[];
}[] = [
  {
    key: 'livingSpace',
    question: '현재 주거 공간은 어느 정도인가요?',
    options: [
      { value: 'small', label: '좁은 편 (원룸·오피스텔)', description: '20평 미만' },
      { value: 'medium', label: '보통 (아파트·빌라)', description: '20~40평' },
      { value: 'large', label: '넓은 편 (단독주택·마당 있음)', description: '40평 이상 또는 야외 공간 있음' },
    ],
  },
  {
    key: 'activityLevel',
    question: '평소 활동량이 어느 정도인가요?',
    options: [
      { value: 'low', label: '낮음', description: '실내에서 주로 생활해요' },
      { value: 'medium', label: '보통', description: '가끔 산책·운동을 즐겨요' },
      { value: 'high', label: '높음', description: '매일 활발하게 야외 활동을 해요' },
    ],
  },
  {
    key: 'experience',
    question: '반려동물을 키워본 경험이 있나요?',
    options: [
      { value: 'none', label: '없음', description: '처음 키우는 거예요' },
      { value: 'some', label: '약간 있음', description: '키워본 적은 있지만 오래되었어요' },
      { value: 'experienced', label: '경험 많음', description: '반려동물 키우기에 자신 있어요' },
    ],
  },
  {
    key: 'timeAvailable',
    question: '하루 중 반려동물과 함께할 수 있는 시간은?',
    options: [
      { value: 'less_than_2h', label: '2시간 미만', description: '바쁜 일상이에요' },
      { value: '2_to_4h', label: '2~4시간', description: '적당히 시간이 있어요' },
      { value: 'more_than_4h', label: '4시간 이상', description: '함께하는 시간이 많아요' },
    ],
  },
  {
    key: 'householdType',
    question: '가족 구성은 어떻게 되나요?',
    options: [
      { value: 'alone', label: '1인 가구', description: '혼자 생활해요' },
      { value: 'family_no_kids', label: '성인 가족', description: '어린이 없는 가족이에요' },
      { value: 'family_with_kids', label: '어린이 있는 가족', description: '아이가 있어요' },
      { value: 'elderly', label: '어르신 가구', description: '어르신과 함께 살아요' },
    ],
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const { answers, currentStep, setAnswer, nextStep, prevStep, reset } = useSurveyStore();
  const setMatchResult = useMatchStore((s) => s.setResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q = QUESTIONS[currentStep];
  const currentAnswer = answers[q.key] as string | undefined;
  const isLast = currentStep === QUESTIONS.length - 1;

  async function handleNext() {
    if (!currentAnswer) return;
    if (!isLast) { nextStep(); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyAnswers: answers as SurveyAnswers, numOfRows: 20 }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error.message); return; }
      setMatchResult(data.data);
      reset();
      router.push('/result');
    } catch {
      setError('매칭 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-6 space-y-8">
      <SurveyProgress current={currentStep} total={QUESTIONS.length} />

      <SurveyQuestion
        question={q.question}
        options={q.options}
        selected={currentAnswer}
        onSelect={(value) => setAnswer(q.key, value as SurveyAnswers[typeof q.key])}
      />

      {error && <p className="text-sm font-mono text-error">{error}</p>}

      <div className="flex gap-3">
        {currentStep > 0 && (
          <Button variant="secondary" size="lg" className="flex-1" onClick={prevStep}>
            이전
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!currentAnswer}
          loading={loading}
          onClick={handleNext}
        >
          {isLast ? 'AI 매칭 시작' : '다음'}
        </Button>
      </div>
    </div>
  );
}
