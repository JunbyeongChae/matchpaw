# matchpaw — 작업 현황

> 현재 Phase와 작업 목록을 순서대로 관리한다.
> 작업을 시작하면 `[ ]` → `[~]`, 완료하면 `[~]` → `[x]`로 바꾼다.
>
> - `[ ]` 대기
> - `[~]` 진행 중
> - `[x]` 완료

---

## 현재 단계: Phase 4 — UI 전체 구현 (6/18~23)

### TODO

- [x] Figma 디자인 1회 읽기 → `docs/design-spec.md` 저장 + `globals.css` @theme 토큰 반영
- [x] `app/layout.tsx` — 공통 레이아웃, TanStack Query Provider, 헤더/푸터
- [x] `store/authStore.ts` — Zustand 인증 상태 (로그인 유저 전역 관리)
- [x] `components/common/` — Button, Card, Modal, Skeleton 공통 컴포넌트
- [x] `components/common/AuthModal.tsx` — 로그인/회원가입 모달 (헤더에서 열림)
- [x] `app/(pages)/page.tsx` — 홈 (/) 서비스 소개, 설문 시작 CTA
- [x] `store/surveyStore.ts` — Zustand 설문 답변 상태
- [x] `components/features/survey/` — 설문 문항 컴포넌트, 진행 표시
- [x] `app/(pages)/survey/page.tsx` — 라이프스타일 설문 (5문항)
- [x] `hooks/useMatch.ts` — TanStack Query 매칭 mutation
- [x] `store/matchStore.ts` — Zustand 매칭 결과 상태
- [x] `components/features/result/` — 매칭 카드 (점수·코멘트·이유)
- [x] `app/(pages)/result/page.tsx` — AI 매칭 결과
- [x] `hooks/useAnimals.ts` — TanStack Query 동물 목록/상세 훅
- [x] `components/features/animals/` — 동물 카드 컴포넌트
- [x] `app/(pages)/animals/page.tsx` — 유기동물 목록 + 필터
- [x] `app/(pages)/animals/[id]/page.tsx` — 유기동물 상세 + 체크리스트 생성 버튼
- [x] `app/(pages)/checklist/page.tsx` — AI 입양 체크리스트 조회·토글
- [x] `hooks/useFavorites.ts` — TanStack Query 찜 훅
- [x] `components/features/favorites/` — 찜 카드 컴포넌트
- [x] `app/(pages)/favorites/page.tsx` — 찜 목록 (로그인 게이트)
- [ ] 반응형 (375px~1440px) 전 구간 확인

---

## Phase 3 — Route Handler 전체 구현 (6/14~20)

### DONE

- [x] `app/api/auth/register/route.ts` — POST: 회원가입
- [x] `app/api/auth/login/route.ts` — POST: 로그인, JWT 발급, httpOnly 쿠키
- [x] `app/api/auth/logout/route.ts` — POST: 쿠키 삭제
- [x] `app/api/auth/me/route.ts` — GET: 내 정보 조회
- [x] `app/api/animals/route.ts` — GET: 유기동물 목록
- [x] `app/api/animals/[id]/route.ts` — GET: 유기동물 단건
- [x] `app/api/match/route.ts` — POST: Claude 매칭 분석, 비회원 일 2회 제한
- [x] `app/api/checklist/route.ts` — POST: Claude 체크리스트 생성
- [x] `app/api/checklists/route.ts` — GET: 내 체크리스트 목록
- [x] `app/api/checklists/[id]/items/[itemId]/route.ts` — PATCH: 체크 항목 토글
- [x] `app/api/favorites/route.ts` — GET: 찜 목록, POST: 찜 추가
- [x] `app/api/favorites/[id]/route.ts` — DELETE: 찜 삭제

---

## Phase 2 — 외부 API 클라이언트 구현 (6/13~14)

### DONE

- [x] `lib/auth.ts` — JWT 발급/검증, bcrypt 해싱 유틸
- [x] `lib/animalApi.ts` — 공공 유기동물 API v2 클라이언트 (목록 조회, 단건 조회)
- [x] `lib/claudeApi.ts` — Claude API 클라이언트 (매칭 분석, 체크리스트 생성)
- [x] Claude 배치 JSON 파싱 성공 확인 ← **임계 조건**

---

## Phase 1 — 타입 정의 및 외부 API 검증 (6/12~13)

### DONE

- [x] `types/animal.ts` — 공공 유기동물 API 응답 타입 정의
- [x] `types/survey.ts` — 설문 항목 타입 정의
- [x] `types/match.ts` — Claude API 매칭 결과 타입 정의
- [x] `types/checklist.ts` — 체크리스트 타입 정의
- [x] `types/auth.ts` — 인증 관련 타입 정의
- [x] `types/api.ts` — 공통 API 응답 래퍼 타입 정의
- [x] 공공 유기동물 API 응답 실제 호출 후 타입 검증 (v2 엔드포인트 필드 기준으로 수정)
- [x] `prisma/schema.prisma` 확정 — Favorite·Checklist userId 인덱스 추가 + `prisma db push` 완료

---

## Phase 0 — 프로젝트 초기 세팅 (6/11)

### DONE

- [x] Next.js 프로젝트 생성 (`npx create-next-app@latest`)
- [x] TypeScript + Tailwind CSS + App Router 설정 확인
- [x] `.env.example` 작성
- [x] GitHub 저장소 생성 + push
- [x] Neon DB 계정 생성 및 프로젝트 생성
- [x] `prisma/schema.prisma` 초안 작성
- [x] `prisma db push`로 Neon DB에 스키마 반영
- [x] Vercel 프로젝트 생성 + GitHub 연결
- [x] Vercel ↔ Neon 통합 연결 (환경변수 자동 주입 확인)
- [x] 빈 프로젝트 Vercel 배포 확인
- [x] 공공 유기동물 API 키 신청

---

## 전체 Phase 로드맵

| Phase | 기간 | 핵심 목표 | 임계 조건 |
|---|---|---|---|
| **Phase 0** | 6/11 | 프로젝트 세팅, 배포 확인, API 키 신청 | Vercel 배포 URL 확인 |
| **Phase 1** | 6/12–13 | `types/` 정의, Prisma 마이그레이션, 공공 API 응답 검증 | `prisma db push` 성공 |
| **Phase 2** | 6/13–14 | 외부 API 클라이언트 구현, Claude 배치 호출 프로토타입 | 배치 JSON 파싱 성공 ← **임계** |
| **Phase 3** | 6/14–20 | 전체 Route Handler 구현 | API 엔드포인트 전체 동작 |
| **Phase 4** | 6/18–23 | UI 전체 구현, 반응형·에러·로딩 | 375px 레이아웃 확인 |
| **Phase 5** | 6/23–25 | 통합 테스트, PRD 체크리스트 통과, 최종 배포 | Vercel 최종 배포 URL |
