import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Favorite } from '@/types/favorite';

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (!data.success) return [];
      return data.data.favorites;
    },
  });

  const favorites = data ?? [];
  const favoriteIds = new Set(favorites.map((f) => f.animalId));

  const addMutation = useMutation({
    mutationFn: async ({ animalId, imageUrl, kindNm }: { animalId: string; imageUrl?: string; kindNm?: string }) => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, imageUrl, kindNm }),
      });
      if (!res.ok) throw new Error('찜 추가 실패');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId: number) => {
      await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  function toggle(animalId: string, imageUrl?: string, kindNm?: string) {
    const existing = favorites.find((f) => f.animalId === animalId);
    if (existing) removeMutation.mutate(existing.id);
    else addMutation.mutate({ animalId, imageUrl, kindNm });
  }

  return { favorites, favoriteIds, toggle };
}
