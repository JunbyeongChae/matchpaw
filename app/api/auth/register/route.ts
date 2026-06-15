import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password, nickname } = await req.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '이메일, 비밀번호, 닉네임은 필수입니다.' } },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { success: false, error: { code: 'EMAIL_TAKEN', message: '이미 사용 중인 이메일입니다.' } },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, nickname },
    select: { id: true, email: true, nickname: true, createdAt: true },
  });

  return NextResponse.json({ success: true, data: { user } }, { status: 201 });
}
