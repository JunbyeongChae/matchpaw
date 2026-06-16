'use client';

import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import FavoriteCard from '@/components/features/favorites/FavoriteCard';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/common/Button';

export default function FavoritesPage() {
  const user = useAuthStore((s) => s.user);
  const { favorites, removeById } = useFavorites();

  if (!user) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-16 text-center space-y-4">
        <p className="text-4xl">🔒</p>
        <h2 className="font-mono font-medium text-[18px] text-text-primary">로그인이 필요해요</h2>
        <p className="font-mono text-[13px] text-text-muted">
          찜 목록은 로그인 후 이용할 수 있어요
        </p>
        <Link href="/">
          <Button variant="primary" size="md" className="mt-2">홈으로 가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-6 space-y-5">
      <div>
        <h1 className="font-mono font-medium text-[22px] text-text-primary">찜 목록</h1>
        <p className="font-mono text-[13px] text-text-muted mt-0.5">
          {favorites.length}마리를 찜했어요
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-4xl">🐾</p>
          <p className="font-mono text-[14px] text-text-muted">아직 찜한 동물이 없어요</p>
          <Link href="/animals">
            <Button variant="secondary" size="md" className="mt-2">동물 보러 가기</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              onRemove={removeById}
            />
          ))}
        </div>
      )}
    </div>
  );
}
