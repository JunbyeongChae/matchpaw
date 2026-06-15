import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { fetchAnimalList } from '@/lib/animalApi';
import { analyzeMatch } from '@/lib/claudeApi';
import type { SurveyAnswers } from '@/types/survey';

const DAILY_LIMIT = 2;

function getToday(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isLoggedIn = token ? !!verifyToken(token) : false;

  if (!isLoggedIn) {
    const ip = getIp(req);
    const today = getToday();

    const record = await prisma.dailyMatchCount.upsert({
      where: { ipAddress_date: { ipAddress: ip, date: today } },
      update: { count: { increment: 1 } },
      create: { ipAddress: ip, date: today, count: 1 },
    });

    if (record.count > DAILY_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'RATE_LIMIT', message: '비회원은 하루 2회까지 매칭을 이용할 수 있습니다.' },
        },
        { status: 429 }
      );
    }
  }

  const body: { surveyAnswers: SurveyAnswers; numOfRows?: number } = await req.json();
  const { surveyAnswers, numOfRows = 20 } = body;

  if (!surveyAnswers) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '설문 답변이 필요합니다.' } },
      { status: 400 }
    );
  }

  let animals: Awaited<ReturnType<typeof fetchAnimalList>>['items'];
  try {
    const { items } = await fetchAnimalList({ numOfRows, state: 'notice' });
    animals = items;
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'ANIMAL_API_ERROR', message: '유기동물 데이터를 불러오지 못했습니다.' } },
      { status: 502 }
    );
  }

  if (animals.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: 'NO_ANIMALS', message: '현재 매칭 가능한 동물이 없습니다.' } },
      { status: 404 }
    );
  }

  let claudeResponse: Awaited<ReturnType<typeof analyzeMatch>>;
  try {
    claudeResponse = await analyzeMatch({ surveyAnswers, animals });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'AI_ERROR', message: 'AI 매칭 분석에 실패했습니다. 잠시 후 다시 시도해주세요.' } },
      { status: 502 }
    );
  }

  const matchedAnimals = claudeResponse.matches
    .map((m) => {
      const animal = animals.find((a) => a.desertionNo === m.desertionNo);
      if (!animal) return null;
      return { animal, score: m.score, comment: m.comment, reasons: m.reasons };
    })
    .filter(Boolean);

  const result = {
    matches: matchedAnimals,
    surveyAnswers,
    generatedAt: new Date().toISOString(),
  };

  const ip = getIp(req);
  try {
    await prisma.matchLog.create({
      data: {
        ipAddress: ip,
        surveyData: surveyAnswers as object,
        resultData: result as object,
      },
    });
  } catch {
    // matchLog 실패는 결과 반환에 영향 없음
  }

  return NextResponse.json({ success: true, data: result });
}
