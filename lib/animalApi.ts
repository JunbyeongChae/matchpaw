import type { AbandonedAnimalItem, AbandonedAnimalResponse, AnimalListParams } from '@/types/animal';

const BASE_URL = 'https://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2';

function buildParams(params: AnimalListParams): URLSearchParams {
  const query = new URLSearchParams({
    serviceKey: process.env.ANIMAL_API_KEY!,
    _type: 'json',
    numOfRows: String(params.numOfRows ?? 20),
    pageNo: String(params.pageNo ?? 1),
  });

  if (params.bgnde) query.set('bgnde', params.bgnde);
  if (params.endde) query.set('endde', params.endde);
  if (params.upkind) query.set('upkind', params.upkind);
  if (params.kind) query.set('kind', params.kind);
  if (params.upr_cd) query.set('upr_cd', params.upr_cd);
  if (params.org_cd) query.set('org_cd', params.org_cd);
  if (params.care_reg_no) query.set('care_reg_no', params.care_reg_no);
  if (params.state) query.set('state', params.state);

  return query;
}

function normalizeItems(raw: AbandonedAnimalItem | AbandonedAnimalItem[]): AbandonedAnimalItem[] {
  return Array.isArray(raw) ? raw : [raw];
}

export async function fetchAnimalList(params: AnimalListParams = {}): Promise<{
  items: AbandonedAnimalItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}> {
  const url = `${BASE_URL}?${buildParams(params)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) throw new Error(`공공 API 오류: ${res.status}`);

  const data: AbandonedAnimalResponse = await res.json();
  const body = data.response.body;

  const rawItems = body.items?.item;
  const normalized = rawItems ? normalizeItems(rawItems) : [];
  const seen = new Set<string>();
  const items = normalized.filter((a) => {
    if (seen.has(a.desertionNo)) return false;
    seen.add(a.desertionNo);
    return true;
  });

  return {
    items,
    totalCount: body.totalCount,
    pageNo: body.pageNo,
    numOfRows: body.numOfRows,
  };
}

export async function fetchAnimalById(desertionNo: string): Promise<AbandonedAnimalItem | null> {
  // 공공 API는 desertionNo 단일 조회를 지원하지 않으므로 공고 중 목록에서 검색
  const params = buildParams({ numOfRows: 100, pageNo: 1, state: 'notice' });

  const url = `${BASE_URL}?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`공공 API 오류: ${res.status}`);

  const data: AbandonedAnimalResponse = await res.json();
  const rawItems = data.response.body.items?.item;

  if (!rawItems) return null;

  const items = normalizeItems(rawItems);
  return items.find((a) => a.desertionNo === desertionNo) ?? null;
}
