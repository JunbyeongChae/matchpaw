'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from './Modal';
import Button from './Button';
import { useAuthStore } from '@/store/authStore';

type Mode = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);

  function reset() {
    setEmail('');
    setPassword('');
    setNickname('');
    setError('');
  }

  function switchMode(next: Mode) {
    setMode(next);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('올바른 이메일 형식이 아닙니다.');
          return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
          setError('비밀번호는 영문 대/소문자, 숫자를 포함해 8자 이상이어야 합니다.');
          return;
        }
        if (nickname.length < 2 || nickname.length > 20) {
          setError('닉네임은 2자 이상 20자 이하여야 합니다.');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, nickname }),
        });
        const data = await res.json();
        if (!data.success) { setError(data.error.message); return; }
        switchMode('login');
        setError('가입 완료! 로그인해주세요.');
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error.message); return; }

      setUser(data.data.user);
      onClose();
      reset();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) {
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      return;
    }
    setUser(null);
    onClose();
  }

  const user = useAuthStore((s) => s.user);

  if (user) {
    return (
      <Modal open={open} onClose={onClose} title="내 계정">
        <div className="space-y-4">
          <div className="p-4 bg-surface-peach rounded-card">
            <p className="text-sm font-mono text-text-muted">닉네임</p>
            <p className="text-base font-mono font-medium text-text-primary mt-0.5">{user.nickname}</p>
            <p className="text-sm font-mono text-text-muted mt-1">{user.email}</p>
          </div>
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? '로그인' : '회원가입'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-mono text-text-muted mb-1.5">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="닉네임을 입력하세요"
              className="w-full px-4 py-3 rounded-card border border-border-default bg-surface-page text-text-primary font-mono text-sm placeholder:text-text-subtle focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>
        )}

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

        <div>
          <label className="block text-sm font-mono text-text-muted mb-1.5">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-card border border-border-default bg-surface-page text-text-primary font-mono text-sm placeholder:text-text-subtle focus:outline-none focus:border-brand-secondary transition-colors"
          />
        </div>

        {error && (
          <p className={`text-sm font-mono ${error.includes('완료') ? 'text-teal' : 'text-error'}`}>
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          {mode === 'login' ? '로그인' : '가입하기'}
        </Button>

        <p className="text-center text-sm font-mono text-text-muted">
          {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          {' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-text-brand underline"
          >
            {mode === 'login' ? '회원가입' : '로그인'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="text-center text-sm font-mono text-text-muted">
            <Link href="/forgot-password" onClick={onClose} className="text-text-muted underline">
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        )}
      </form>
    </Modal>
  );
}
