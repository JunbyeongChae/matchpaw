import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: { favorites } });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const { animalId, imageUrl, kindNm } = await req.json();
  if (!animalId) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: 'animalId가 필요합니다.' } },
      { status: 400 }
    );
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_animalId: { userId: payload.userId, animalId } },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, error: { code: 'ALREADY_FAVORITED', message: '이미 찜한 동물입니다.' } },
      { status: 409 }
    );
  }

  const favorite = await prisma.favorite.create({
    data: { userId: payload.userId, animalId, imageUrl: imageUrl ?? null, kindNm: kindNm ?? null },
  });

  return NextResponse.json({ success: true, data: { favorite } }, { status: 201 });
}
