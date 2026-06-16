'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error.message);
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.');
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-surface-page">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-mono font-bold text-text-primary mb-2">비밀번호 찾기</h1>
        <p className="text-sm font-mono text-text-muted mb-8">
          가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
        </p>

        {status === 'sent' ? (
          <div className="p-4 bg-surface-peach rounded-card space-y-3">
            <p className="text-sm font-mono text-text-primary font-medium">이메일을 확인해주세요</p>
            <p className="text-sm font-mono text-text-muted">
              입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다.<br />
              링크는 1시간 동안 유효합니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-text-muted mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-3 rounded-card border border-border-default bg-surface-page text-text-primary font-mono text-sm placeholder:text-text-subtle focus:outline-none focus:border-brand-secondary transition-colors"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm font-mono text-error">{errorMessage}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={status === 'loading'}
              className="w-full"
            >
              재설정 링크 보내기
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm font-mono text-text-muted">
          <Link href="/" className="text-text-brand underline">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
