'use client';

import Link from 'next/link';
import { useAnimals } from '@/hooks/useAnimals';
import AnimalCard from '@/components/features/animals/AnimalCard';
import { AnimalCardSkeleton } from '@/components/common/Skeleton';
import { useFavorites } from '@/hooks/useFavorites';

export default function HomePage() {
  const { data, isLoading } = useAnimals({ numOfRows: 4, state: 'notice' });
  const { favoriteIds, toggle } = useFavorites();

  return (
    <div className="max-w-[390px] mx-auto px-5 space-y-8 pb-8">
      {/* Hero */}
      <section
        className="rounded-card px-6 py-10 mt-4 relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-hero)' }}
      >
        <h1
          className="font-mono font-medium text-[40px] leading-[52px] text-text-primary mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          나에게 꼭 맞는<br />단짝,<br />AI가 찾아줄게요
        </h1>
        <p className="font-mono font-medium text-[16px] leading-7 text-text-body mb-8">
          나의 라이프스타일과 주거 환경에 딱<br />맞는 유기동물을 AI가 추천해 드립니다.
        </p>
        <Link
          href="/survey"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-pill bg-brand-primary text-brand-deep font-mono font-medium text-[14px]"
          style={{ boxShadow: '0px 4px 20px 0px rgba(255, 140, 66, 0.2)' }}
        >
          매칭 시작하기
        </Link>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="font-sans font-semibold text-[22px] leading-8 text-text-primary text-center">
          matchpaw와 함께하는<br />행복한 여정
        </h2>
        <div className="space-y-3">
          {STEPS.map((step) => (
            <div
              key={step.no}
              className="bg-surface-card rounded-card p-5 flex gap-4 items-start"
              style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-xl"
                style={{ backgroundColor: step.iconBg }}
              >
                {step.emoji}
              </div>
              <div>
                <p className="font-mono font-medium text-[14px] text-text-primary mb-1">
                  {step.title}
                </p>
                <p className="font-mono font-medium text-[12px] text-text-body leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animal Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono font-medium text-[22px] text-text-primary">
              가족을 기다리는 아이들
            </h2>
            <p className="font-mono text-[14px] text-text-muted mt-0.5">
              최근 등록된 보호 중인 아이들이에요
            </p>
          </div>
          <Link href="/animals" className="font-mono text-[14px] text-text-brand underline shrink-0">
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <AnimalCardSkeleton key={i} />)
            : data?.items.map((animal, i) => (
                <AnimalCard
                  key={animal.desertionNo}
                  animal={animal}
                  isFavorited={favoriteIds.has(animal.desertionNo)}
                  onFavorite={toggle}
                  priority={i === 0}
                />
              ))}
        </div>
      </section>

      {/* FAB */}
      <Link
        href="/survey"
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center z-40"
        style={{ boxShadow: '0px 8px 30px 0px rgba(255, 140, 66, 0.3)' }}
        aria-label="매칭 시작하기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-brand-deep)">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      </Link>
    </div>
  );
}

const STEPS = [
  {
    no: 1,
    emoji: '📋',
    iconBg: 'var(--color-badge-dog-bg)',
    title: '1. 라이프스타일 설문',
    desc: '주거 환경과 활동량 등 5가지 질문을 통해 나를 알려주세요.',
  },
  {
    no: 2,
    emoji: '🤖',
    iconBg: 'var(--color-badge-cat-bg)',
    title: '2. AI 맞춤 추천',
    desc: '전국 보호소의 데이터를 분석해 나와 가장 잘 어울리는 아이를 찾습니다.',
  },
  {
    no: 3,
    emoji: '✅',
    iconBg: 'var(--color-surface-muted)',
    title: '3. 입양 준비 가이드',
    desc: '입양 전 꼭 필요한 준비물과 체크리스트를 AI가 만들어 드립니다.',
  },
];
