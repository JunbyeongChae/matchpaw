import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS);

    const rateLimit = await prisma.emailRateLimit.upsert({
      where: { ipAddress_windowStart: { ipAddress: ip, windowStart } },
      update: { count: { increment: 1 } },
      create: { ipAddress: ip, windowStart, count: 1 },
    });

    if (rateLimit.count > RATE_LIMIT) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: '잠시 후 다시 시도해주세요.' } },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: '이메일을 입력해주세요.' } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
        data: { used: true },
      });

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt },
      });

      await sendPasswordResetEmail(user.email, token);
    }

    return NextResponse.json({
      success: true,
      data: { message: '가입된 이메일이라면 재설정 링크를 발송했습니다.' },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}
