import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const favoriteId = Number(id);

  const favorite = await prisma.favorite.findUnique({ where: { id: favoriteId } });
  if (!favorite || favorite.userId !== payload.userId) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: '접근 권한이 없습니다.' } },
      { status: 403 }
    );
  }

  await prisma.favorite.delete({ where: { id: favoriteId } });

  return NextResponse.json({ success: true, data: null });
}
