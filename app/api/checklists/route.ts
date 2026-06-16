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

  const checklists = await prisma.checklist.findMany({
    where: { userId: payload.userId },
    include: { items: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  return NextResponse.json({ success: true, data: { checklists } });
}
