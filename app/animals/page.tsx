'use client';

import { useState } from 'react';
import { useAnimals } from '@/hooks/useAnimals';
import AnimalCard from '@/components/features/animals/AnimalCard';
import { AnimalCardSkeleton } from '@/components/common/Skeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/common/AuthModal';
import { DOG_UP_KIND_CD, CAT_UP_KIND_CD } from '@/lib/constants';

const FILTERS = [
  { label: '전체', value: '' },
  { label: '강아지', value: DOG_UP_KIND_CD },
  { label: '고양이', value: CAT_UP_KIND_CD },
];

export default function AnimalsPage() {
  const [upkind, setUpkind] = useState('');
  const [page, setPage] = useState(1);

  const [authOpen, setAuthOpen] = useState(false);
  const { data, isLoading, isError } = useAnimals({ upkind, pageNo: page, numOfRows: 18, state: 'notice' });
  const { favoriteIds, toggle } = useFavorites();
  const user = useAuthStore((s) => s.user);

  function handleToggle(animalId: string, imageUrl?: string, kindNm?: string) {
    if (!user) { setAuthOpen(true); return; }
    toggle(animalId, imageUrl, kindNm);
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-6 space-y-5">
      <h1 className="font-mono font-medium text-[22px] text-text-primary">유기동물</h1>

      {/* 필터 */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setUpkind(f.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-pill font-mono text-[13px] font-medium border transition-colors ${
              upkind === f.value
                ? 'bg-brand-primary text-brand-deep border-brand-primary'
                : 'bg-surface-card text-text-muted border-border-default hover:border-brand-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <p className="font-mono text-[13px] text-error text-center py-8">
          데이터를 불러오지 못했습니다.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <AnimalCardSkeleton key={i} />)
          : data?.items.map((animal, i) => (
              <AnimalCard
                key={animal.desertionNo}
                animal={animal}
                isFavorited={favoriteIds.has(animal.desertionNo)}
                onFavorite={handleToggle}
                priority={i === 0}
              />
            ))}
      </div>

      {data && data.totalCount > data.numOfRows && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-pill font-mono text-[13px] border border-border-default disabled:opacity-40"
          >
            이전
          </button>
          <span className="flex items-center font-mono text-[13px] text-text-muted px-2">
            {page} / {Math.ceil(data.totalCount / data.numOfRows)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(data.totalCount / data.numOfRows)}
            className="px-4 py-2 rounded-pill font-mono text-[13px] border border-border-default disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
