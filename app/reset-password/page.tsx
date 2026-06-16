'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!token) {
    return (
      <div className="p-4 bg-surface-peach rounded-card">
        <p className="text-sm font-mono text-error">유효하지 않은 링크입니다.</p>
        <Link href="/forgot-password" className="mt-3 inline-block text-sm font-mono text-text-brand underline">
          비밀번호 찾기로 이동
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setErrorMessage('비밀번호는 영문 대/소문자, 숫자를 포함해 8자 이상이어야 합니다.');
      return;
    }
    if (password !== confirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error.message);
        setStatus('error');
        return;
      }

      setStatus('success');
      setTimeout(() => router.push('/'), 2000);
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="p-4 bg-surface-peach rounded-card">
        <p className="text-sm font-mono text-text-primary font-medium">비밀번호가 변경되었습니다</p>
        <p className="text-sm font-mono text-text-muted mt-1">잠시 후 홈으로 이동합니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-mono text-text-muted mb-1.5">새 비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="영문 대/소문자, 숫자 포함 8자 이상"
          className="w-full px-4 py-3 rounded-card border border-border-default bg-surface-page text-text-primary font-mono text-sm placeholder:text-text-subtle focus:outline-none focus:border-brand-secondary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-text-muted mb-1.5">비밀번호 확인</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="비밀번호를 다시 입력하세요"
          className="w-full px-4 py-3 rounded-card border border-border-default bg-surface-page text-text-primary font-mono text-sm placeholder:text-text-subtle focus:outline-none focus:border-brand-secondary transition-colors"
        />
      </div>

      {errorMessage && (
        <p className="text-sm font-mono text-error">{errorMessage}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={status === 'loading'}
        className="w-full"
      >
        비밀번호 변경하기
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-surface-page">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-mono font-bold text-text-primary mb-2">새 비밀번호 설정</h1>
        <p className="text-sm font-mono text-text-muted mb-8">
          새로 사용할 비밀번호를 입력해주세요.
        </p>

        <Suspense fallback={<div className="text-sm font-mono text-text-muted">로딩 중...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-6 text-center text-sm font-mono text-text-muted">
          <Link href="/" className="text-text-brand underline">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
