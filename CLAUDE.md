# matchpaw — CLAUDE.md

## 프로젝트 개요

유기동물 입양 AI 매칭 플랫폼. 라이프스타일 설문 5문항 → Claude API 분석 → 맞춤 유기동물 추천 + 입양 체크리스트 자동 생성.

- **기간**: 2026-06-11 ~ 2026-06-25 (15일, 개인 포트폴리오)
- **배포**: Vercel (Next.js 풀스택 단일 프로젝트)
- **DB**: PostgreSQL (Neon)

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js App Router (TypeScript) |
| 스타일 | Tailwind CSS |
| 서버 상태 | TanStack Query |
| 클라이언트 상태 | Zustand |
| ORM | Prisma |
| DB | PostgreSQL (Neon) |
| 인증 | JWT + Bcrypt (httpOnly 쿠키) |
| AI | Claude API (Anthropic) |
| 패키지 | npm (`npm ci` 기본) |

---

## 핵심 아키텍처 원칙

**절대 지켜야 할 규칙:**

1. **외부 API는 Route Handler에서만 호출한다.** Claude API, 공공 유기동물 API를 Client Component에서 직접 호출하지 않는다.
2. **API 키는 서버 전용 환경변수로만 관리한다.** `NEXT_PUBLIC_` 접두사 키는 절대 사용하지 않는다.
3. **DB 접근은 Prisma를 통해서만 수행한다.** Prisma Client는 `lib/prisma.ts` 싱글턴으로 관리한다.
4. **`lib/` 내 외부 API 클라이언트는 Route Handler에서만 import한다.** Client Component에서 import하면 빌드 에러 발생.

**환경변수 목록:**

```bash
DATABASE_URL=          # Neon (Vercel 통합 시 자동 주입)
JWT_SECRET=
ANIMAL_API_KEY=        # 국가동물보호정보시스템
ANTHROPIC_API_KEY=     # Claude API
```

---

## 폴더 구조

```
matchpaw/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx                     # 홈 (/)
│   │   ├── survey/page.tsx              # 라이프스타일 설문
│   │   ├── result/page.tsx              # AI 매칭 결과
│   │   ├── animals/
│   │   │   ├── page.tsx                 # 유기동물 목록
│   │   │   └── [id]/page.tsx            # 유기동물 상세
│   │   ├── checklist/page.tsx           # AI 입양 체크리스트
│   │   └── favorites/page.tsx           # 찜 목록 (회원 전용)
│   ├── api/                             # Route Handlers — 서버 전용
│   │   ├── match/route.ts
│   │   ├── animals/route.ts
│   │   ├── animals/[id]/route.ts
│   │   ├── checklist/route.ts
│   │   ├── checklists/route.ts
│   │   ├── checklists/[id]/items/[itemId]/route.ts
│   │   ├── favorites/route.ts
│   │   ├── favorites/[id]/route.ts
│   │   └── auth/{register,login,logout,me}/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── common/                          # Button, Card, Modal, Skeleton
│   └── features/                        # survey/, result/, animals/, favorites/
├── hooks/                               # useAnimals, useMatch, useFavorites
├── store/                               # authStore, surveyStore, matchStore
├── lib/
│   ├── prisma.ts                        # Prisma Client 싱글턴
│   ├── animalApi.ts                     # 공공 유기동물 API 클라이언트
│   ├── claudeApi.ts                     # Claude API 클라이언트
│   └── auth.ts                          # JWT, bcrypt 유틸
├── types/
├── prisma/schema.prisma
└── .env.example
```

---

## API 응답 형식

모든 Route Handler는 아래 형식을 따른다:

```json
// 성공
{ "success": true, "data": {} }

// 실패
{ "success": false, "error": { "code": "string", "message": "string" } }
```

---

## Git 관리 규칙

### 브랜치 전략 (GitHub Flow)

`main`은 항상 실행 가능한 상태. 작업 브랜치를 따로 만들어 작업 후 `main`에 병합.

```
main
└─ feature/작업명
└─ fix/작업명
└─ refactor/작업명
└─ style/작업명
└─ docs/작업명
└─ chore/작업명
```

**브랜치 네이밍:**

```
feature/login-page
fix/header-layout
refactor/button-component
style/main-layout
docs/readme-update
chore/project-setting
```

### Commit 메시지

```
type: 작업 내용
```

| Commit Type | 의미 |
|---|---|
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | UI/CSS 수정 |
| `docs` | 문서 수정 |
| `chore` | 설정 및 기타 작업 |

> 브랜치명에는 `feature`, 커밋 메시지에는 `feat` 사용 (Conventional Commits 관례).

**예시:**

```
feat: 로그인 페이지 구현
fix: 모바일 헤더 레이아웃 수정
refactor: Button 컴포넌트 구조 정리
chore: ESLint 설정 추가
```

### PR 규칙

**PR 제목:**

```
[type] 작업 제목
```

**PR 본문:** 작업 내용 / 확인 방법 / 스크린샷 또는 참고 자료

### 병합 전 셀프 체크리스트

- [ ] 의도한 작업을 모두 완료했는가
- [ ] `console.log`, 디버깅 코드, 불필요한 주석을 제거했는가
- [ ] 로컬에서 정상 동작을 직접 확인했는가
- [ ] UI 변경이 있다면 화면이 깨지지 않는가

### Merge 규칙

- 병합 방식: **Squash and merge** (main 히스토리를 깔끔하게 유지)
- 병합 후 작업 브랜치 삭제
- 충돌 발생 시 `rebase`로 해결 (Merge 커밋 없이 선형 히스토리 유지)

**충돌 해결 절차:**

```bash
git checkout main && git pull origin main
git checkout feature/작업명
git rebase main
# 충돌 파일 수정 후
git add .
git rebase --continue
git push origin feature/작업명 --force-with-lease
```

### 작업 흐름 요약

```
1. 최신 main pull
2. 작업 브랜치 생성
3. 작업 진행 + Commit 작성
4. 원격 브랜치 Push
5. PR 생성
6. 셀프 체크 후 main에 Squash merge
7. 작업 브랜치 삭제
```

---

## 개발 마일스톤

| 기간 | Phase | 핵심 작업 |
|---|---|---|
| 6/11 | Phase 0 | Next.js 생성, Neon DB 연결, Vercel 배포, 공공 API 키 신청 |
| 6/12–13 | Phase 1 | `types/` 정의, Prisma schema + `prisma db push`, 공공 API 응답 검증 |
| 6/13–14 | Phase 2 | `lib/prisma.ts`, `lib/animalApi.ts`, `lib/claudeApi.ts` 배치 호출 프로토타입 |
| 6/14–20 | Phase 3 | 전체 Route Handler 구현 (auth·animals·match·checklist·favorites) |
| 6/18–23 | Phase 4 | UI 전체 구현, Zustand·TanStack Query 연결, 반응형·에러·로딩 UI |
| 6/23–25 | Phase 5 | 전체 통합 테스트, PRD 출시 전 체크리스트 통과, README, 최종 배포 |

> **임계 경로**: Phase 2에서 Claude 배치 JSON 파싱 성공 확인 후 Phase 3 진입.

---

## 코딩 규칙

- **주석 금지**: 이름만으로 의도가 명확하지 않을 때만 한 줄 추가. 무조건 주석 제거보다 필요한 경우 허용.
- **에러 처리**: 시스템 경계(외부 API, 사용자 입력)에서만 처리. 내부 코드는 신뢰.
- **컴포넌트 분리**: `common/`은 기능 독립적 재사용 UI. `features/`는 도메인별 컴포넌트.
- **타입 안정성**: 공공 API, Claude API 응답은 반드시 `types/`에 명시적 타입 정의.
- **반응형**: 375px ~ 1440px 전 구간 정상 렌더링.
- **시맨틱 HTML**: 접근성을 위해 시맨틱 태그 사용.
- **커밋 메시지 언어**: 한국어로 작성한다. (예: `feat: 로그인 페이지 구현`)
- **테스트 방침**: 단위 테스트 파일은 작성하지 않는다. Route Handler는 로컬에서 직접 실행해 동작을 확인한다. UI는 브라우저에서 직접 확인한다.

---

## Claude API 설정

이 프로젝트에서 Claude API를 호출할 때는 아래 모델을 사용한다.

```typescript
// lib/claudeApi.ts
model: 'claude-sonnet-4-6'
```

- **모델**: `claude-sonnet-4-6`
- **용도**: 설문 분석, 감성 코멘트 배치 생성, 입양 체크리스트 생성
- 모델을 임의로 변경하지 않는다. 변경이 필요하면 사용자에게 먼저 확인한다.

---

## 세션 시작 루틴

새 대화가 시작되면 코드 작성 전에 아래 순서로 현재 상태를 파악하고 사용자에게 보고한다.

1. `TASKS.md` 읽기 → 현재 Phase와 TODO / 진행 중 항목 확인
2. `git status` + `git branch` 실행 → 현재 브랜치와 변경사항 확인
3. 아래 형식으로 상태 요약 후 "어디서부터 시작할까요?" 질문

```
## 현재 상태

- **Phase**: Phase X — 설명
- **브랜치**: feature/xxx (또는 main)
- **다음 작업**: TASKS.md 기준 첫 번째 TODO 항목

어디서부터 시작할까요?
```

---

## Git 액션 타이밍 규칙

Claude는 아래 시점에 Git 액션을 먼저 제안한다. 사용자가 수락하면 명령어를 실행한다.

| 시점 | 제안 내용 | 예시 |
|---|---|---|
| 새 작업을 시작하기 전 | 브랜치 생성 | `feature/survey-page 브랜치를 만들까요?` |
| 작업 단위 하나가 완료됐을 때 | 커밋 | `feat: 설문 페이지 UI 구현 으로 커밋할까요?` |
| 모든 작업이 완료되고 배포 준비가 됐을 때 | PR 생성 | `[feature] 설문 페이지 구현 으로 PR을 만들까요?` |
| PR이 머지된 후 | 브랜치 삭제 | `feature/survey-page 브랜치를 삭제할까요?` |

**추가 원칙:**
- 브랜치 생성 전 항상 `main`의 최신 상태를 pull한다.
- 커밋 전 병합 전 셀프 체크리스트(console.log 제거, 로컬 동작 확인 등)를 함께 안내한다.
- PR 생성 시 제목과 본문 초안을 함께 제시한 뒤 컨펌을 받는다.

---

## 작업 진행 방식

모든 작업은 아래 순서를 반드시 따른다.

1. **계획 먼저**: 작업을 시작하기 전에 무엇을 어떤 순서로 할지 계획을 텍스트로 제시한다.
2. **컨펌 대기**: 사용자가 확인("ㅇㅇ", "진행해", "ok" 등)을 주기 전까지 코드 작성을 시작하지 않는다.
3. **진행**: 컨펌 후 계획대로 구현한다.
4. **TASKS.md 업데이트**: 완료된 항목을 DONE으로 이동한다.

**계획 제시 형식 예시:**

```
## 작업 계획: feat/login-page

1. `app/(pages)/login/page.tsx` — 로그인 폼 UI 구현
2. `app/api/auth/login/route.ts` — POST 핸들러, bcrypt 검증, JWT 발급
3. `lib/auth.ts` — verifyPassword, signToken 함수 추가
4. `store/authStore.ts` — 로그인 후 user 상태 저장

진행할까요?
```

---

## 작업 추적 및 챌린지 기록 규칙

### TASKS.md 관리

`TASKS.md`는 현재 Phase의 작업 목록을 순서대로 관리한다. Claude는 아래 규칙에 따라 자동으로 업데이트한다.

- 작업을 시작할 때: `[ ]` → `[~]` (진행 중)
- 작업이 완료될 때: `[~]` → `[x]` + 해당 항목을 `DONE` 섹션으로 이동
- Phase가 전환될 때: 다음 Phase의 TODO 목록을 `TASKS.md`에 추가

### CHALLENGES.md 관리

`docs/CHALLENGES.md`는 개발 중 막혔던 문제와 해결 과정을 기록한다. Claude는 아래 상황에서 자동으로 항목을 추가한다.

- 동일한 문제로 2회 이상 시도가 필요했던 경우
- 예상치 못한 에러나 외부 API 동작으로 설계를 변경한 경우
- 사용자가 "이거 챌린지로 기록해줘"라고 요청한 경우

**기록 형식:**

```markdown
## CH-XX. 제목

**날짜**: YYYY-MM-DD
**Phase**: Phase X
**난이도**: 상 / 중 / 하

### Problem
무슨 문제가 발생했는가?

### Tried
어떤 것들을 시도했는가?

### Solution
최종적으로 어떻게 해결했는가?

### Lesson
이 경험에서 얻은 인사이트. 포트폴리오에서 강조할 포인트.
```

---

## 보안 체크리스트 (배포 전 반드시 확인)

- [ ] `ANTHROPIC_API_KEY`, `ANIMAL_API_KEY`가 `NEXT_PUBLIC_` 없이 서버 전용으로만 사용됨
- [ ] `console.log`가 모두 제거됨
- [ ] 비밀번호가 bcrypt 해시로 저장됨 (평문 저장 금지)
- [ ] JWT가 httpOnly 쿠키로 저장됨
- [ ] 비회원 매칭 횟수 제한(일 2회)이 시크릿 모드에서도 동작함
