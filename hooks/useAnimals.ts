import { useQuery } from '@tanstack/react-query';
import type { AbandonedAnimalItem } from '@/types/animal';

interface AnimalListResult {
  items: AbandonedAnimalItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

interface AnimalListParams {
  pageNo?: number;
  numOfRows?: number;
  upkind?: string;
  state?: string;
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
  });
}

export function useAnimal(id: string) {
  return useQuery<AbandonedAnimalItem>({
    queryKey: ['animal', id],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error.message);
      return data.data.animal;
    },
    enabled: !!id,
  });
}
