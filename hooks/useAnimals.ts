import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AbandonedAnimalItem, AnimalListParams } from '@/types/animal';

interface AnimalListResult {
  items: AbandonedAnimalItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

export function useAnimals(params: AnimalListParams = {}) {
  const query = new URLSearchParams();
  if (params.pageNo) query.set('pageNo', String(params.pageNo));
  if (params.numOfRows) query.set('numOfRows', String(params.numOfRows));
  if (params.upkind) query.set('upkind', params.upkind);
  if (params.state) query.set('state', params.state);

  return useQuery<AnimalListResult>({
    queryKey: ['animals', params],
    queryFn: async () => {
      const res = await fetch(`/api/animals?${query}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error.message);
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAnimal(id: string) {
  const queryClient = useQueryClient();

  return useQuery<AbandonedAnimalItem>({
    queryKey: ['animal', id],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error.message);
      return data.data.animal;
    },
    initialData: () => {
      const cached = queryClient.getQueriesData<AnimalListResult>({ queryKey: ['animals'] });
      for (const [, result] of cached) {
        const found = result?.items.find((a) => a.desertionNo === id);
        if (found) return found;
      }
    },
    enabled: !!id,
  });
}
