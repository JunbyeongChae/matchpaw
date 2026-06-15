import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { generateChecklist } from '@/lib/claudeApi';
import type { CreateChecklistBody } from '@/types/checklist';

export async function POST(req: NextRequest) {
  const body: CreateChecklistBody = await req.json();
  const { animalId, animalKind, animalAge, animalSpecialMark } = body;

  if (!animalId || !animalKind || !animalAge || !animalSpecialMark) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '동물 정보가 누락되었습니다.' } },
      { status: 400 }
    );
  }

  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;
  const userId = payload?.userId ?? null;

  const claudeResponse = await generateChecklist({ animalId, animalKind, animalAge, animalSpecialMark });

  const checklist = await prisma.checklist.create({
    data: {
      userId,
      animalId,
      title: claudeResponse.title,
      items: {
        create: claudeResponse.items.map((item) => ({
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
