import type { SurveyAnswers } from './survey';
import type { AbandonedAnimalItem } from './animal';

export interface MatchedAnimal {
  animal: AbandonedAnimalItem;
  score: number;          // 0~100 매칭 점수
  comment: string;        // Gemini가 생성한 감성 코멘트
  reasons: string[];      // 매칭 이유 목록
}

export interface MatchResult {
  matches: MatchedAnimal[];
  surveyAnswers: SurveyAnswers;
  generatedAt: string;    // ISO 날짜 문자열
}

export interface GeminiMatchRequest {
  surveyAnswers: SurveyAnswers;
  animals: AbandonedAnimalItem[];
}

export interface GeminiMatchResponse {
  matches: {
    desertionNo: string;
    score: number;
    comment: string;
    reasons: string[];
  }[];
}

export interface MatchLogData {
  id: number;
  ipAddress: string;
  surveyData: SurveyAnswers;
  resultData: MatchResult;
  createdAt: string;
}
