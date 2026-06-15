'use client';

import { create } from 'zustand';
import type { MatchResult } from '@/types/match';

interface MatchState {
  result: MatchResult | null;
  setResult: (result: MatchResult) => void;
  clear: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clear: () => set({ result: null }),
}));
