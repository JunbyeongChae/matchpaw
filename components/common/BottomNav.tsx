'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '홈', icon: HomeIcon },
  { href: '/animals', label: '유기동물', icon: PawIcon },
  { href: '/checklist', label: '체크리스트', icon: CheckIcon },
  { href: '/favorites', label: '찜 목록', icon: HeartIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card"
      style={{
        borderRadius: '16px 16px 0 0',
        boxShadow: '0px -4px 20px 0px rgba(74, 63, 53, 0.06)',
      }}
    >
      <div className="max-w-[390px] mx-auto flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-pill transition-colors ${
                isActive ? 'bg-brand-primary' : ''
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-brand-deep' : 'text-text-muted'}`}
              />
              {!isActive && (
                <span className="text-[14px] font-mono font-medium text-text-muted leading-5">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm15 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 10c-3.59 0-6.5 2.91-6.5 6.5 0 2.42 1.72 4.5 4 4.5.55 0 1.08-.14 1.55-.38.61-.31 1.29-.62 2-.62.7 0 1.38.3 2 .62.46.24 1 .38 1.55.38 2.28 0 4-2.08 4-4.5C18.5 12.91 15.59 10 12 10z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
