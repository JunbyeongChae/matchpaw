'use client';

import Link from 'next/link';
import Image from 'next/image';
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
        <div className="w-14 h-14 rounded-card overflow-hidden bg-surface-muted shrink-0">
          {favorite.imageUrl ? (
            <Image
              src={favorite.imageUrl}
              alt="동물 사진"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
          )}
        </div>
        <div className="min-w-0">
          {favorite.kindNm && (
            <p className="font-mono font-medium text-[14px] text-text-primary truncate">
              {favorite.kindNm}
            </p>
          )}
          <p className="font-mono text-[12px] text-text-muted mt-0.5">
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
