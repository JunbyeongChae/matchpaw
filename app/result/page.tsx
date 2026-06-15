'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMatchStore } from '@/store/matchStore';
import MatchCard from '@/components/features/result/MatchCard';
import Button from '@/components/common/Button';

export default function ResultPage() {
  const router = useRouter();
  const result = useMatchStore((s) => s.result);

  useEffect(() => {
    if (!result) router.replace('/survey');
  }, [result, router]);

  if (!result) return null;

  const sorted = [...result.matches].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="max-w-[390px] mx-auto px-5 py-6 space-y-6">
      <div>
        <h1 className="font-mono font-medium text-[24px] text-text-primary">AI 매칭 결과</h1>
        <p className="font-mono text-[13px] text-text-muted mt-1">
          {sorted.length}마리의 친구가 기다리고 있어요
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((match, i) => (
          <MatchCard key={match.animal.desertionNo} match={match} rank={i + 1} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/survey" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            다시 매칭하기
          </Button>
        </Link>
        <Link href="/animals" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            전체 보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
