import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const { email, password, nickname } = await req.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '이메일, 비밀번호, 닉네임은 필수입니다.' } },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_EMAIL', message: '올바른 이메일 형식이 아닙니다.' } },
      { status: 400 }
    );
  }

  if (!PASSWORD_REGEX.test(password)) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_PASSWORD', message: '비밀번호는 영문 대/소문자, 숫자를 포함해 8자 이상이어야 합니다.' } },
      { status: 400 }
    );
  }

  if (nickname.length < 2 || nickname.length > 20) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_NICKNAME', message: '닉네임은 2자 이상 20자 이하여야 합니다.' } },
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
