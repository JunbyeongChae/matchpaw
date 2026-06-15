'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, setUser, setLoading } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUser(data.data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setUser, setLoading]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-page h-16 flex items-center px-5">
      <div className="w-full max-w-[600px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-sans font-semibold text-text-brand tracking-tight">
            matchpaw
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="w-9 h-9 rounded-full bg-avatar-bg border border-border-default flex items-center justify-center"
            >
              <span className="text-xs font-label font-semibold text-text-brand">
                {user.nickname[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="text-sm font-mono font-medium text-text-brand px-4 py-1.5 rounded-pill border border-border-default hover:bg-surface-warm transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
