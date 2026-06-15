import { NextRequest, NextResponse } from 'next/server';
import { fetchAnimalById } from '@/lib/animalApi';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let animal: Awaited<ReturnType<typeof fetchAnimalById>>;
  try {
    animal = await fetchAnimalById(id);
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'ANIMAL_API_ERROR', message: '유기동물 데이터를 불러오지 못했습니다.' } },
      { status: 502 }
    );
  }

  if (!animal) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: '동물 정보를 찾을 수 없습니다.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { animal } });
}
