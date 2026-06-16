'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ChecklistSkeleton } from '@/components/common/Skeleton';
import Button from '@/components/common/Button';
import type { Checklist } from '@/types/checklist';

export default function ChecklistPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: checklists, isLoading } = useQuery<Checklist[]>({
    queryKey: ['checklists'],
    queryFn: async () => {
      const res = await fetch('/api/checklists');
      const data = await res.json();
      if (!data.success) return [];
      return data.data.checklists;
    },
    enabled: !!user,
    staleTime: 0,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ checklistId, itemId, isChecked }: { checklistId: number; itemId: number; isChecked: boolean }) => {
      const res = await fetch(`/api/checklists/${checklistId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isChecked }),
      });
      if (!res.ok) throw new Error('토글 실패');
    },
    onMutate: async ({ checklistId, itemId, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: ['checklists'] });
      const previous = queryClient.getQueryData<Checklist[]>(['checklists']);
      queryClient.setQueryData<Checklist[]>(['checklists'], (old) =>
        old?.map((cl) =>
          cl.id === checklistId
            ? { ...cl, items: cl.items.map((it) => it.id === itemId ? { ...it, isChecked } : it) }
            : cl
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['checklists'], context.previous);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['checklists'] }),
  });

  if (!user) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-16 text-center space-y-4">
        <p className="text-4xl">📋</p>
        <h2 className="font-mono font-medium text-[18px] text-text-primary">로그인이 필요해요</h2>
        <p className="font-mono text-[13px] text-text-muted">
          체크리스트는 로그인 후 저장돼요
        </p>
        <Link href="/animals">
          <Button variant="primary" size="md" className="mt-2">동물 보러 가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-6 space-y-6">
      <div>
        <h1 className="font-mono font-medium text-[22px] text-text-primary">입양 체크리스트</h1>
        <p className="font-mono text-[13px] text-text-muted mt-0.5">
          AI가 만들어 준 맞춤 체크리스트예요
        </p>
      </div>

      {isLoading && <ChecklistSkeleton />}

      {!isLoading && (!checklists || checklists.length === 0) && (
        <div className="py-16 text-center space-y-3">
          <p className="text-4xl">✨</p>
          <p className="font-mono text-[14px] text-text-muted">
            아직 체크리스트가 없어요
          </p>
          <Link href="/animals">
            <Button variant="secondary" size="md" className="mt-2">동물 보러 가기</Button>
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {checklists?.map((checklist) => {
          const done = checklist.items.filter((i) => i.isChecked).length;
          const total = checklist.items.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div
              key={checklist.id}
              className="bg-surface-card rounded-card p-4 space-y-4"
              style={{ boxShadow: '0px 4px 20px 0px rgba(74, 63, 53, 0.06)' }}
            >
              <div>
                <h2 className="font-mono font-medium text-[16px] text-text-primary">{checklist.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-text-muted shrink-0">
                    {done}/{total}
                  </span>
                </div>
              </div>

              <ul className="space-y-2">
                {checklist.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          checklistId: checklist.id,
                          itemId: item.id,
                          isChecked: !item.isChecked,
                        })
                      }
                      className={`w-5 h-5 rounded shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${
                        item.isChecked
                          ? 'bg-brand-primary border-brand-primary'
                          : 'border-border-default'
                      }`}
                    >
                      {item.isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-brand-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`font-mono text-[13px] leading-relaxed ${
                        item.isChecked ? 'line-through text-text-muted' : 'text-text-body'
                      }`}
                    >
                      {item.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
