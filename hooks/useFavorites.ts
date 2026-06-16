import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Favorite } from '@/types/favorite';

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites');
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      const data = await res.json();
      if (!data.success) return [];
      return data.data.favorites;
    },
    staleTime: 1000 * 30,
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
    onError: () => alert('찜 추가에 실패했습니다. 다시 시도해주세요.'),
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId: number) => {
      const res = await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('찜 삭제 실패');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError: () => alert('찜 삭제에 실패했습니다. 다시 시도해주세요.'),
  });

  function toggle(animalId: string, imageUrl?: string, kindNm?: string) {
    if (addMutation.isPending || removeMutation.isPending) return;
    const existing = favorites.find((f) => f.animalId === animalId);
    if (existing) removeMutation.mutate(existing.id);
    else addMutation.mutate({ animalId, imageUrl, kindNm });
  }

  function removeById(favoriteId: number) {
    if (removeMutation.isPending) return;
    removeMutation.mutate(favoriteId);
  }

  return { favorites, favoriteIds, toggle, removeById };
}
