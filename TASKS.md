# matchpaw — 작업 현황

> 현재 Phase와 작업 목록을 순서대로 관리한다.
> 작업을 시작하면 `[ ]` → `[~]`, 완료하면 `[~]` → `[x]`로 바꾼다.
>
> - `[ ]` 대기
> - `[~]` 진행 중
> - `[x]` 완료

---

## 7차 이슈 수정 — 비회원 찜 에러 처리

### DONE

- [x] #O1 `hooks/useFavorites.ts` — addMutation/removeMutation 401 응답 구분: "다시 시도" → "로그인이 필요합니다" 메시지로 분기
- [x] #O2 `app/animals/[id]/page.tsx` — 찜 버튼 onClick에 비회원 체크 추가 (AuthModal 오픈)
- [x] #O3 `app/animals/page.tsx` — user 체크 래퍼 함수 + AuthModal 추가

---

## 6차 이슈 수정

### DONE

- [x] #N1 `checklists/[id]/items/[itemId]/route.ts` — IDOR 취약점: `where: { id: checklistItemId, checklistId }` 로 소속 검증 추가 (High)
- [x] #N2 `match/route.ts` — `numOfRows` 무제한 입력 방지: `Math.min(numOfRows ?? 20, 100)` 클램핑 추가 (High)
- [x] #N3 `forgot-password/route.ts` — 미가입 이메일 404 → 200으로 통일해 이메일 열거 공격 차단 (Medium)
- [x] #N4 `forgot-password/route.ts` — IP 기반 분당 3회 rate limit 추가 (Medium)
- [x] #N5 `auth/register`, `auth/login` — Prisma P2002 unique 충돌 → 500 대신 409 반환 (Medium)
- [x] #N6 `useFavorites` — 401 응답 묵살 → 에러 throw로 인증 만료 감지 (Medium)
- [x] #N7 `match/route.ts` — 비회원 rate limit 선증가: 매칭 실패 시에도 횟수 차는 문제 수정 (Medium)

---

## 5차 이슈 수정

### DONE

- [x] #M1 `animals/page.tsx` — 매직 넘버 `'417000'`, `'422400'` → `DOG_UP_KIND_CD`, `CAT_UP_KIND_CD` 상수 적용 (`lib/constants.ts`에 `CAT_UP_KIND_CD` 추가 포함)
- [x] #M2 `types/survey.ts` — 사용되지 않는 제네릭 타입 `SurveyQuestion<T>`, `SurveyOption<T>` 제거
- [x] #M3 `types/api.ts` — dead type 파일 삭제 (`ApiResponse`, `ApiError`, `ApiSuccess`, `PaginatedData` 전부 미사용)
- [x] #M4 `checklist/page.tsx` — `staleTime: 0` 제거
- [x] #M5 `api/checklist/route.ts` — `geminiResponse` 암묵적 any → `Awaited<ReturnType<typeof generateChecklist>>` 명시적 타입 추가

---

## 4차 이슈 수정

### DONE

- [x] #L1 `authStore` — `isLoading` / `setLoading` dead state 제거
- [x] #L2 `useAnimals` — 로컬 재정의 타입 제거, `AnimalListParams` import로 통일
- [x] #L3 `favorites/page.tsx` — `id → animalId → id` 순환 제거, `useFavorites`에 `removeById` 추가
- [x] #L4 `api/auth/me` — 만료 토큰 401 응답 시 쿠키 삭제 추가
- [x] #L5 `lib/email.ts` — 버튼 미작동 시 URL 직접 복사 안내 문구 추가

---

## 3차 이슈 수정

### DONE

- [x] #K1 `reset-password/page.tsx` — `PASSWORD_REGEX` 인라인 중복, `lib/validation.ts` import로 교체
- [x] #K2 `types/match.ts` — Gemini 전환 후 "Claude" 주석 미수정
- [x] #K3 `useFavorites.toggle` — mutation 진행 중 중복 클릭 방어 (`isPending` 가드)
- [x] #K4 `AuthModal.handleLogout` — 로그아웃 중 로딩 상태 없음
- [x] #K5 `Card.tsx` — 미사용 컴포넌트 삭제
- [x] #K6 동물 종 판별 매직 넘버 `'417000'` 세 곳 중복 → 상수 추출
- [x] #K7 `types/animal.ts` — `state` 파라미터 주석 오류 및 리터럴 유니온 타입으로 개선

---

## 2차 이슈 수정

### DONE

- [x] #J1 `AuthModal` — `error` state에 성공 메시지 담는 구조 수정 (`status` 분리)
- [x] #J2 `/api/animals` — `pageNo=abc` 같은 입력에서 `NaN`이 외부 API에 전달되는 버그 수정
- [x] #J3 Validation 정규식 중복 — `lib/validation.ts`로 추출해 클라이언트·서버 공유
- [x] #J4 체크리스트 API — 전체 fetch 후 UI `slice(0,1)` → API에서 최신 1개만 반환하도록 개선
- [x] #J5 비밀번호 재설정 토큰 — 새 토큰 발급 시 기존 미만료 토큰 무효화
- [x] #J6 `useFavorites` — 찜 추가·삭제 실패 시 `onError` 피드백 추가
- [x] #J7 `favorites/[id]` DELETE — 없는 리소스 404 / 권한 없음 403 분리

---

## 1차 이슈 수정

### DONE

- [x] #I1 `hooks/useMatch.ts` Dead Code 제거 — `survey/page.tsx` 직접 fetch 사용 중, hook 파일 삭제
- [x] #I2 `fetchAnimalById` 탐색 범위 개선 — notice 100건 제한으로 상세 페이지 "찾을 수 없음" 발생
- [x] #I3 `claudeApi.ts` → `geminiApi.ts` 리네임 — 파일명·타입명·import 전체 교체
- [x] #I4 체크리스트 토글 낙관적 업데이트 + 에러 피드백 추가
- [x] #I5 dead code 제거 — 미사용 변수·컴포넌트·import 정리
- [x] 비밀번호 찾기/재설정 기능 구현 (Resend 이메일 발송)
- [x] Vercel 환경변수 `RESEND_API_KEY`, `APP_URL` 추가
- [x] 신규이슈: `/forgot-password` 404 — 이미 구현 완료 (머지 전 리포트)

---

## 버그픽스 & 개선

### DONE

- [x] #01 `/api/match` — AI 분석 실패 시 에러 처리 및 클라이언트 피드백
- [x] #02 `/api/animals` — 공공 API 실패 시 에러 처리
- [x] #03 비로그인 체크리스트 생성 — 비회원 체크리스트 흐름 정의 및 처리
- [x] #04 회원가입 유효성 검사 — 이메일 형식, 비밀번호 8자 이상 클라이언트 검증
- [x] #05 로그아웃 안전성 — 로그아웃 후 캐시 초기화 및 리다이렉트 처리
- [x] #06 날짜 UTC 버그 — rate limit 날짜 UTC→KST 변환 오류 수정
- [x] #07 이미지 도메인 — `next.config.ts`에 공공 API 이미지 도메인 https 허용 추가
- [x] 모바일 로그아웃 버튼 BottomNav에 가려지는 버그 (`Header` 스태킹 컨텍스트)

---

## Phase 4 — UI 전체 구현 (6/18~23)

### DONE

- [x] Figma 디자인 1회 읽기 → `docs/design-spec.md` 저장 + `globals.css` @theme 토큰 반영
- [x] `app/layout.tsx` — 공통 레이아웃, TanStack Query Provider, 헤더/푸터
- [x] `store/authStore.ts` — Zustand 인증 상태 (로그인 유저 전역 관리)
- [x] `components/common/` — Button, Card, Modal, Skeleton 공통 컴포넌트
- [x] `components/common/AuthModal.tsx` — 로그인/회원가입 모달 (헤더에서 열림)
- [x] `app/(pages)/page.tsx` — 홈 (/) 서비스 소개, 설문 시작 CTA, 실제 동물 4마리 표시
- [x] `store/surveyStore.ts` — Zustand 설문 답변 상태
- [x] `components/features/survey/` — 설문 문항 컴포넌트, 진행 표시
- [x] `app/(pages)/survey/page.tsx` — 라이프스타일 설문 (5문항)
- [x] `hooks/useMatch.ts` — TanStack Query 매칭 mutation
- [x] `store/matchStore.ts` — Zustand 매칭 결과 상태
- [x] `components/features/result/` — 매칭 카드 (사진·점수·코멘트·이유, 상위 5개)
- [x] `app/(pages)/result/page.tsx` — AI 매칭 결과
- [x] `hooks/useAnimals.ts` — TanStack Query 동물 목록/상세 훅 (캐시 기반 단건 조회)
- [x] `components/features/animals/` — 동물 카드 컴포넌트 (kindNm 표시)
- [x] `app/(pages)/animals/page.tsx` — 유기동물 목록 + 필터
- [x] `app/(pages)/animals/[id]/page.tsx` — 유기동물 상세 + 체크리스트 생성 버튼
- [x] `app/(pages)/checklist/page.tsx` — AI 입양 체크리스트 조회·토글 (최근 1개)
- [x] `hooks/useFavorites.ts` — TanStack Query 찜 훅 (imageUrl·kindNm 저장)
- [x] `components/features/favorites/` — 찜 카드 (사진·품종명·날짜)
- [x] `app/(pages)/favorites/page.tsx` — 찜 목록 (로그인 게이트)
- [x] Claude API → Gemini API 전환 (`gemini-2.5-flash-lite`)
- [x] `prisma/schema.prisma` — Favorite에 imageUrl·kindNm 필드 추가

---

## Phase 5 — 통합 테스트 및 최종 배포 (6/23~25)

### DONE

- [x] Vercel 환경변수 설정 (`GEMINI_API_KEY`, `ANIMAL_API_KEY`, `JWT_SECRET`)
- [x] Vercel 배포 후 전체 기능 통합 테스트
- [x] 반응형 (375px~1440px) 전 구간 확인
- [x] 보안 체크리스트 통과 (API 키 노출 없음, console.log 제거, 비회원 제한 검증)
- [x] README 작성

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
