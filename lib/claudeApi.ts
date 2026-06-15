import Anthropic from '@anthropic-ai/sdk';
import type { ClaudeMatchRequest, ClaudeMatchResponse } from '@/types/match';
import type { ClaudeChecklistRequest, ClaudeChecklistResponse } from '@/types/checklist';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-6';

export async function analyzeMatch(req: ClaudeMatchRequest): Promise<ClaudeMatchResponse> {
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

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system:
      '당신은 유기동물 입양 매칭 전문가입니다. ' +
      '반드시 아래 JSON 형식으로만 응답하십시오. 설명, 마크다운, 코드 블록 없이 순수 JSON만 출력하십시오.\n' +
      '{"matches":[{"desertionNo":"string","score":number,"comment":"string","reasons":["string"]}]}',
    messages: [
      {
        role: 'user',
        content:
          `사용자 라이프스타일 설문 결과:\n${JSON.stringify(req.surveyAnswers, null, 2)}\n\n` +
          `유기동물 목록 (최대 ${req.animals.length}마리):\n${JSON.stringify(animalSummaries, null, 2)}\n\n` +
          '각 동물에 대해 매칭 점수(0~100), 한 줄 감성 코멘트(한국어, 1~2문장), 매칭 이유 2~3가지를 JSON으로 반환하십시오. ' +
          '점수 기준: 생활 공간, 활동량, 경험, 가용 시간, 가족 구성을 종합 고려.',
      },
    ],
  });

  const raw = message.content[0];
  if (raw.type !== 'text') throw new Error('Claude 응답이 텍스트가 아닙니다.');

  const parsed: ClaudeMatchResponse = JSON.parse(raw.text);

  if (!Array.isArray(parsed.matches)) {
    throw new Error('Claude 응답 파싱 실패: matches 배열이 없습니다.');
  }

  return parsed;
}

export async function generateChecklist(req: ClaudeChecklistRequest): Promise<ClaudeChecklistResponse> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      '당신은 유기동물 입양 전문가입니다. ' +
      '반드시 아래 JSON 형식으로만 응답하십시오. 설명, 마크다운, 코드 블록 없이 순수 JSON만 출력하십시오.\n' +
      '{"title":"string","items":[{"content":"string","order":number}]}',
    messages: [
      {
        role: 'user',
        content:
          `입양 대상 동물 정보:\n` +
          `- 동물 ID: ${req.animalId}\n` +
          `- 종류: ${req.animalKind}\n` +
          `- 나이: ${req.animalAge}\n` +
          `- 특징: ${req.animalSpecialMark}\n\n` +
          '이 동물을 입양하기 전 준비해야 할 체크리스트를 10~15개 항목으로 작성하십시오. ' +
          '제목은 동물 종류와 특징을 반영해 구체적으로 작성하고, 각 항목은 실질적이고 행동 중심적으로 서술하십시오.',
      },
    ],
  });

  const raw = message.content[0];
  if (raw.type !== 'text') throw new Error('Claude 응답이 텍스트가 아닙니다.');

  const parsed: ClaudeChecklistResponse = JSON.parse(raw.text);

  if (typeof parsed.title !== 'string' || !Array.isArray(parsed.items)) {
    throw new Error('Claude 응답 파싱 실패: title 또는 items가 없습니다.');
  }

  return parsed;
}
