import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { generateChecklist } from '@/lib/geminiApi';
import type { CreateChecklistBody } from '@/types/checklist';

export async function POST(req: NextRequest) {
  const body: CreateChecklistBody = await req.json();
  const { animalId, animalKind, animalAge, animalSpecialMark } = body;

  if (!animalId || !animalKind || !animalAge) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '동물 정보가 누락되었습니다.' } },
      { status: 400 }
    );
  }

  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const userId = payload.userId;

  let geminiResponse;
  try {
    geminiResponse = await generateChecklist({
      animalId,
      animalKind,
      animalAge,
      animalSpecialMark: animalSpecialMark || '특이사항 없음',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI 오류';
    return NextResponse.json(
      { success: false, error: { code: 'AI_ERROR', message } },
      { status: 502 }
    );
  }

  const checklist = await prisma.checklist.create({
    data: {
      userId,
      animalId,
      title: geminiResponse.title,
      items: {
        create: geminiResponse.items.map((item) => ({
          content: item.content,
          order: item.order,
          isChecked: false,
        })),
      },
    },
    include: { items: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json({ success: true, data: { checklist } }, { status: 201 });
}
