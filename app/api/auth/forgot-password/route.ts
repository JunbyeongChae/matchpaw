import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: '이메일을 입력해주세요.' } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: '가입되지 않은 이메일입니다.' } },
        { status: 404 }
      );
    }

    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, isUsed: false, expiresAt: { gt: new Date() } },
      data: { isUsed: true },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({
      success: true,
      data: { message: '비밀번호 재설정 링크를 이메일로 발송했습니다.' },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}
