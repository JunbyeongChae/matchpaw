import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { UpdateChecklistItemBody } from '@/types/checklist';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
      { status: 401 }
    );
  }

  const { id, itemId } = await params;
  const checklistId = Number(id);
  const checklistItemId = Number(itemId);

  const checklist = await prisma.checklist.findUnique({ where: { id: checklistId } });
  if (!checklist || checklist.userId !== payload.userId) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: '접근 권한이 없습니다.' } },
      { status: 403 }
    );
  }

  const body: UpdateChecklistItemBody = await req.json();

  const item = await prisma.checklistItem.update({
    where: { id: checklistItemId },
    data: { isChecked: body.isChecked },
  });

  return NextResponse.json({ success: true, data: { item } });
}
