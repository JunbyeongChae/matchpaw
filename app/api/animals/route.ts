import { NextRequest, NextResponse } from 'next/server';
import { fetchAnimalList } from '@/lib/animalApi';
import type { AnimalListParams } from '@/types/animal';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params: AnimalListParams = {
    pageNo: searchParams.get('pageNo') ? Number(searchParams.get('pageNo')) : undefined,
    numOfRows: searchParams.get('numOfRows') ? Number(searchParams.get('numOfRows')) : undefined,
    upkind: searchParams.get('upkind') ?? undefined,
    kind: searchParams.get('kind') ?? undefined,
    upr_cd: searchParams.get('upr_cd') ?? undefined,
    org_cd: searchParams.get('org_cd') ?? undefined,
    state: searchParams.get('state') ?? undefined,
    bgnde: searchParams.get('bgnde') ?? undefined,
    endde: searchParams.get('endde') ?? undefined,
  };

  try {
    const result = await fetchAnimalList(params);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'ANIMAL_API_ERROR', message: '유기동물 데이터를 불러오지 못했습니다.' } },
      { status: 502 }
    );
  }
}
