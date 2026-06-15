'use client';

import { create } from 'zustand';
import type { SurveyAnswers } from '@/types/survey';

interface SurveyState {
  answers: Partial<SurveyAnswers>;
  currentStep: number;
  setAnswer: <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  answers: {},
  currentStep: 0,
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  reset: () => set({ answers: {}, currentStep: 0 }),
}));
