'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAnimal } from '@/hooks/useAnimals';
import { useFavorites } from '@/hooks/useFavorites';
import { Skeleton } from '@/components/common/Skeleton';
import Button from '@/components/common/Button';

export default function AnimalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: animal, isLoading, isError } = useAnimal(id);
  const { favoriteIds, toggle } = useFavorites();
  const [checklistLoading, setChecklistLoading] = useState(false);

  async function handleCreateChecklist() {
    if (!animal) return;
    setChecklistLoading(true);
    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId: animal.desertionNo,
          animalKind: animal.kindCd,
          animalAge: animal.age,
          animalSpecialMark: animal.specialMark,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error.message);
      router.push('/checklist');
    } catch {
      alert('체크리스트 생성에 실패했습니다.');
    } finally {
      setChecklistLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[390px] mx-auto px-5 py-6 space-y-4">
        <Skeleton className="w-full h-64" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (isError || !animal) {
    return (
      <div className="max-w-[390px] mx-auto px-5 py-12 text-center">
        <p className="font-mono text-text-muted">동물 정보를 찾을 수 없습니다.</p>
        <Button variant="secondary" size="md" className="mt-4" onClick={() => router.back()}>
          돌아가기
        </Button>
      </div>
    );
  }

  const isDog = animal.upKindCd === '417000';
  const isFavorited = favoriteIds.has(animal.desertionNo);

  return (
    <div className="max-w-[390px] mx-auto space-y-0">
      {/* 이미지 */}
      <div className="relative w-full aspect-[4/3] bg-surface-muted">
        {animal.popfile1 ? (
          <Image src={animal.popfile1} alt={animal.kindCd} fill className="object-cover" sizes="390px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            {isDog ? '🐶' : '🐱'}
          </div>
        )}
        <button
          onClick={() => toggle(animal.desertionNo)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="px-5 py-6 space-y-5">
        {/* 기본 정보 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-label font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider"
                style={{
                  backgroundColor: isDog ? 'var(--color-badge-dog-bg)' : 'var(--color-badge-cat-bg)',
                  color: isDog ? 'var(--color-badge-dog-text)' : 'var(--color-badge-cat-text)',
                }}
              >
                {isDog ? 'DOG' : 'CAT'}
              </span>
            </div>
            <h1 className="font-mono font-medium text-[24px] text-text-primary">{animal.kindCd}</h1>
          </div>
        </div>

        {/* 상세 정보 */}
        <div
          className="rounded-card divide-y divide-border-subtle"
          style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
        >
          {[
            ['나이', animal.age],
            ['성별', animal.sexCd === 'M' ? '수컷' : animal.sexCd === 'F' ? '암컷' : '미상'],
            ['체중', animal.weight],
            ['색상', animal.colorCd],
            ['중성화', animal.neuterYn === 'Y' ? '완료' : animal.neuterYn === 'N' ? '미완료' : '미상'],
            ['접수일', animal.happenDt],
            ['보호소', animal.careNm],
            ['지역', animal.orgNm],
            ['특징', animal.specialMark],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-4 px-4 py-3">
              <span className="font-mono text-[12px] text-text-muted w-16 shrink-0">{label}</span>
              <span className="font-mono text-[13px] text-text-body">{value || '—'}</span>
            </div>
          ))}
        </div>

        {/* 체크리스트 생성 */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={checklistLoading}
          onClick={handleCreateChecklist}
        >
          입양 체크리스트 만들기
        </Button>
      </div>
    </div>
  );
}
