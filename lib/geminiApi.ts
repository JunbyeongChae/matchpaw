import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiMatchRequest, GeminiMatchResponse } from '@/types/match';
import type { GeminiChecklistRequest, GeminiChecklistResponse } from '@/types/checklist';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = 'gemini-2.5-flash-lite';

export async function analyzeMatch(req: GeminiMatchRequest): Promise<GeminiMatchResponse> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json' },
    systemInstruction:
      '당신은 유기동물 입양 매칭 전문가입니다. ' +
      '반드시 아래 JSON 형식으로만 응답하십시오.\n' +
      '{"matches":[{"desertionNo":"string","score":number,"comment":"string","reasons":["string"]}]}',
  });

  const animalSummaries = req.animals.map((a) => ({
    desertionNo: a.desertionNo,
    kindCd: a.kindCd,
    sexCd: a.sexCd,
    age: a.age,
    weight: a.weight,
    specialMark: a.specialMark,
    colorCd: a.colorCd,
    neuterYn: a.neuterYn,
  }));

  const prompt =
    `사용자 라이프스타일 설문 결과:\n${JSON.stringify(req.surveyAnswers, null, 2)}\n\n` +
    `유기동물 목록 (${req.animals.length}마리):\n${JSON.stringify(animalSummaries, null, 2)}\n\n` +
    '각 동물에 대해 매칭 점수(0~100), 한 줄 감성 코멘트(한국어, 1~2문장), 매칭 이유 2~3가지를 JSON으로 반환하십시오. ' +
    '점수 기준: 생활 공간, 활동량, 경험, 가용 시간, 가족 구성을 종합 고려.';

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed: GeminiMatchResponse = JSON.parse(text);

  if (!Array.isArray(parsed.matches)) {
    throw new Error('Gemini 응답 파싱 실패: matches 배열이 없습니다.');
  }

  return parsed;
}

export async function generateChecklist(req: GeminiChecklistRequest): Promise<GeminiChecklistResponse> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json' },
    systemInstruction:
      '당신은 유기동물 입양 전문가입니다. ' +
      '반드시 아래 JSON 형식으로만 응답하십시오.\n' +
      '{"title":"string","items":[{"content":"string","order":number}]}',
  });

  const prompt =
    `입양 대상 동물 정보:\n` +
    `- 동물 ID: ${req.animalId}\n` +
    `- 종류: ${req.animalKind}\n` +
    `- 나이: ${req.animalAge}\n` +
    `- 특징: ${req.animalSpecialMark}\n\n` +
    '이 동물을 입양하기 전 준비해야 할 체크리스트를 10~15개 항목으로 작성하십시오. ' +
    '제목은 동물 종류와 특징을 반영해 구체적으로 작성하고, 각 항목은 실질적이고 행동 중심적으로 서술하십시오.';

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed: GeminiChecklistResponse = JSON.parse(text);

  if (typeof parsed.title !== 'string' || !Array.isArray(parsed.items)) {
    throw new Error('Gemini 응답 파싱 실패: title 또는 items가 없습니다.');
  }

  return parsed;
}
