import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    const res = NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: '유효하지 않은 토큰입니다.' } },
      { status: 401 }
    );
    res.cookies.set('token', '', { maxAge: 0, path: '/' });
    return res;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, nickname: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { user } });
}
