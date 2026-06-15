'use client';

import Link from 'next/link';
import type { Favorite } from '@/types/favorite';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: number) => void;
}

export default function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  return (
    <div
      className="bg-surface-card rounded-card p-4 flex items-center justify-between gap-3"
      style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
    >
      <Link href={`/animals/${favorite.animalId}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-card bg-surface-peach flex items-center justify-center text-xl shrink-0">
          🐾
        </div>
        <div className="min-w-0">
          <p className="font-mono font-medium text-[14px] text-text-primary truncate">
            {favorite.animalId}
          </p>
          <p className="font-mono text-[11px] text-text-muted mt-0.5">
            {new Date(favorite.createdAt).toLocaleDateString('ko-KR')} 찜
          </p>
        </div>
      </Link>
      <button
        onClick={() => onRemove(favorite.id)}
        className="text-error text-lg shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
      >
        ♥
      </button>
    </div>
  );
}
