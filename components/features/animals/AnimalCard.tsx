'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { AbandonedAnimalItem } from '@/types/animal';
import { DOG_UP_KIND_CD } from '@/lib/constants';

interface AnimalCardProps {
  animal: AbandonedAnimalItem;
  onFavorite?: (desertionNo: string, imageUrl?: string, kindNm?: string) => void;
  isFavorited?: boolean;
  priority?: boolean;
}

export default function AnimalCard({ animal, onFavorite, isFavorited, priority = false }: AnimalCardProps) {
  const isDog = animal.upKindCd === DOG_UP_KIND_CD;

  return (
    <div
      className="bg-surface-card rounded-card overflow-hidden"
      style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
    >
      <Link href={`/animals/${animal.desertionNo}`}>
        <div className="relative w-full aspect-[4/3] bg-surface-muted rounded-t-card overflow-hidden">
          {animal.popfile1 ? (
            <Image
              src={animal.popfile1}
              alt={animal.kindNm}
              fill
              className="object-cover"
              sizes="(max-width: 390px) 50vw, 200px"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {isDog ? '🐶' : '🐱'}
            </div>
          )}
          {onFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); onFavorite(animal.desertionNo, animal.popfile1, animal.kindNm); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}
            >
              <span className={isFavorited ? 'text-error' : 'text-text-muted'}>
                {isFavorited ? '♥' : '♡'}
              </span>
            </button>
          )}
        </div>
      </Link>

      <div className="p-3 border-t border-border-subtle space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-mono font-medium text-[15px] text-text-primary truncate">
            {animal.kindNm}
          </h3>
          <span
            className="text-[10px] font-label font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider shrink-0"
            style={{
              backgroundColor: isDog ? 'var(--color-badge-dog-bg)' : 'var(--color-badge-cat-bg)',
              color: isDog ? 'var(--color-badge-dog-text)' : 'var(--color-badge-cat-text)',
            }}
          >
            {isDog ? 'DOG' : 'CAT'}
          </span>
        </div>
        <p className="font-mono text-[12px] text-text-body">{animal.age} · {animal.sexCd === 'M' ? '수컷' : animal.sexCd === 'F' ? '암컷' : '미상'}</p>
        <div className="flex items-center gap-1 opacity-70">
          <span className="text-[10px] text-text-muted">📍</span>
          <p className="font-mono text-[11px] text-text-muted truncate">{animal.careNm}</p>
        </div>
      </div>
    </div>
  );
}
