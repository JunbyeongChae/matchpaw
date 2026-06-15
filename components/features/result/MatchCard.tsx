'use client';

import Link from 'next/link';
import type { MatchedAnimal } from '@/types/match';

interface MatchCardProps {
  match: MatchedAnimal;
  rank: number;
}

export default function MatchCard({ match, rank }: MatchCardProps) {
  const { animal, score, comment, reasons } = match;
  const isTop = rank === 1;

  return (
    <div
      className={`bg-surface-card rounded-card overflow-hidden ${isTop ? 'ring-2 ring-brand-primary' : ''}`}
      style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
    >
      {isTop && (
        <div className="bg-brand-primary px-4 py-1.5 text-center">
          <span className="font-mono font-medium text-[12px] text-brand-deep">
            ✨ 최고 매칭
          </span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* 점수 + 이름 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono font-medium text-[11px] text-text-muted mb-0.5">
              #{rank} 매칭
            </p>
            <h3 className="font-mono font-medium text-[20px] text-text-primary">
              {animal.kindCd}
            </h3>
            <p className="font-mono text-[13px] text-text-muted mt-0.5">
              {animal.age} · {animal.sexCd === 'M' ? '수컷' : animal.sexCd === 'F' ? '암컷' : '미상'} · {animal.weight}
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: scoreColor(score) + '20' }}
            >
              <span className="font-mono font-medium text-[18px]" style={{ color: scoreColor(score) }}>
                {score}
              </span>
            </div>
            <p className="font-mono text-[10px] text-text-muted mt-0.5">점</p>
          </div>
        </div>

        {/* 감성 코멘트 */}
        <p className="font-mono text-[13px] leading-relaxed text-text-body bg-surface-hero rounded-card p-3">
          💬 {comment}
        </p>

        {/* 매칭 이유 */}
        <ul className="space-y-1.5">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand-primary text-[12px] mt-0.5">✓</span>
              <span className="font-mono text-[12px] text-text-body">{r}</span>
            </li>
          ))}
        </ul>

        {/* 보호소 */}
        <p className="font-mono text-[11px] text-text-muted opacity-70">
          📍 {animal.careNm} · {animal.orgNm}
        </p>

        <Link
          href={`/animals/${animal.desertionNo}`}
          className="block w-full text-center py-2.5 rounded-pill border border-brand-primary text-text-brand font-mono font-medium text-[13px] hover:bg-surface-hero transition-colors"
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--color-brand-primary)';
  if (score >= 60) return 'var(--color-teal)';
  return 'var(--color-text-muted)';
}
