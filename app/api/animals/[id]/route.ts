import { NextRequest, NextResponse } from 'next/server';
import { fetchAnimalById } from '@/lib/animalApi';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = await fetchAnimalById(id);

  if (!animal) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: '동물 정보를 찾을 수 없습니다.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { animal } });
}
