# TDD (Technical Design Document) — matchpaw

**문서 버전**: v1.0
**작성자**: 개인 프로젝트
**최초 작성일**: 2026-06-11
**최종 수정일**: 2026-06-15
**참조 PRD**: v1.0
**상태**: [ ] 초안 / [ ] 진행 중 / [x] 완료

---

## 0. 문서 목적

이 문서는 **matchpaw** 의 기술 구현 방법을 정의한다.

PRD에서 요구하는 기능을 **어떻게** 구현할지, 기술 스택 선택 이유, 시스템 아키텍처, DB 설계, API 설계, 폴더 구조, 그리고 주요 기술 결정 사항을 기록한다.

---

## 1. 시스템 아키텍처 개요

### 1-1. 전체 구조

```
[브라우저 (React — Next.js Client Components)]
      │
      │ HTTP Request / Cookie (JWT)
      ▼
[Next.js App Router (Vercel)]
  ├── [Page Components — SSR / Client]
  ├── [Route Handlers (/api/*) — 서버 전용]
  └── [Prisma (DB 접근 레이어)]
      │                          │
      │ Prisma                   │ HTTP (Route Handler에서만)
      ▼                          ▼
[PostgreSQL (Neon)]           [외부 API]
                               ├── 국가동물보호정보시스템 (농림축산검역본부)
                               └── Google Gemini API
```

**핵심 원칙**

- 외부 API(Claude API, 공공 유기동물 API)는 반드시 Route Handler(서버) 영역에서만 호출한다. Client Component에서 직접 호출하지 않는다.
- API 키는 서버 전용 환경변수로만 관리한다. `NEXT_PUBLIC_` 접두사 키는 사용하지 않는다.
- DB 접근은 Prisma를 통해서만 수행한다. Prisma Client는 싱글턴으로 관리한다.

---

### 1-2. 핵심 요청 흐름

**AI 매칭 플로우**

```
① 사용자가 설문 5문항 입력 후 "매칭 시작" 클릭
      │
② 클라이언트 → POST /api/match (설문 JSON)
      │
③ Route Handler 처리
   ├── Claude API 호출 #1: 설문 분석 → 적합 동물 유형·특성·필터 조건 추출
   ├── 공공 유기동물 API 호출: 추출된 조건으로 보호중 동물 필터링
   └── Claude API 호출 #2 (배치): 전체 동물 목록 → 감성 코멘트 일괄 생성
      │
④ Route Handler → 클라이언트: 매칭 동물 리스트 + 감성 코멘트 JSON 반환
      │
⑤ 클라이언트: 매칭 결과 카드 렌더링
```

**AI 체크리스트 생성 플로우**

```
① 매칭 결과 페이지에서 "입양 체크리스트 보기" 클릭
      │
② 클라이언트 → POST /api/checklist (동물 종류·나이·특성 JSON)
      │
③ Route Handler: Claude API 호출 → 카테고리별 체크리스트 생성
   (회원이면 Prisma로 DB 저장 후 반환, 비회원이면 DB 저장 없이 반환)
      │
④ 클라이언트: 체크리스트 항목 렌더링
```

---

## 2. 기술 스택

| 분류 | 기술 | 버전 기준 | 선택 이유 |
|---|---|---|---|
| 프레임워크 | Next.js (App Router) | lock 파일 기준 확정 | FE·BE·배포를 단일 프로젝트로 통합. Vercel 단일 배포로 Railway·CORS 설정 불필요 |
| 언어 | TypeScript | lock 파일 기준 확정 | 공공 API·Claude API 응답 등 외부 데이터 타입 안정성 확보 |
| 스타일 | Tailwind CSS | lock 파일 기준 확정 | 빠른 반응형 UI 구성, 유틸리티 클래스로 일관된 디자인 유지 |
| 서버 상태 관리 | TanStack Query | lock 파일 기준 확정 | Client Component에서 서버 상태(공공 API 응답 등) 캐싱·로딩·에러 상태 선언적 처리 |
| 클라이언트 상태 관리 | Zustand | lock 파일 기준 확정 | 설문 응답·매칭 결과 등 페이지 간 공유 상태를 경량으로 관리 |
| ORM | Prisma | lock 파일 기준 확정 | TypeScript 타입 자동 생성, 스키마 기반 마이그레이션 관리 |
| 데이터베이스 | PostgreSQL | Neon 환경 기준 | 서버리스 PostgreSQL. Supabase 대비 순수 DB에 집중 (Auth·Storage 등 불필요한 부가 기능 없음). Vercel 공식 통합으로 환경변수 자동 주입 |
| 인증 | JWT + Bcrypt | lock 파일 기준 확정 | 이메일 인증만 구현하는 MVP에 적합. `next/headers`로 httpOnly 쿠키 직접 제어 |
| AI | Google Gemini API (`gemini-2.5-flash-lite`) | API 버전 확정 | Claude API 무료 티어 없음으로 Gemini API 전환. 설문 분석·감성 코멘트·체크리스트 생성 3개 기능을 동일 SDK로 통일 |
| 배포 | Vercel | — | Next.js 공식 호스팅. FE·BE 단일 배포로 관리 포인트 최소화 |
| 패키지 매니저 | npm | — | 기본 환경으로 추가 설치 불필요 |

### 2-1. 패키지 설치 및 버전 관리 원칙

이 프로젝트는 단일 `package.json`으로 FE·BE 의존성을 통합 관리한다. lock 파일 기준 설치를 원칙으로 한다.

```bash
npm ci
```

- `package-lock.json`을 기준으로 의존성을 설치한다.
- 새로운 패키지를 추가할 때만 `npm install 패키지명`을 사용한다.
- 패키지를 추가하거나 제거한 경우 `package.json`과 `package-lock.json`을 함께 커밋한다.
- lock 파일은 반드시 Git에 커밋한다.

---

## 3. 데이터 설계

### 3-1. 데이터 소스

| 종류 | 설명 | 위치 / 키 |
|---|---|---|
| 외부 API | 전국 유기동물 목록 (종류·지역·보호 상태) | 국가동물보호정보시스템 / `ANIMAL_API_KEY` (서버 전용 환경변수) |
| 외부 API | AI 분석·감성 코멘트·체크리스트 생성 | Google Gemini API / `GEMINI_API_KEY` (서버 전용 환경변수) |
| 데이터베이스 | 회원 정보, 찜 목록 스냅샷, AI 체크리스트 | PostgreSQL (Neon) / `DATABASE_URL` (Vercel 통합으로 자동 주입) |

---

### 3-2. 핵심 데이터 스키마

### User

```json
{
  "id": "string (cuid)",
  "email": "string",
  "password": "string (bcrypt hash)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Animal (DB 미저장)

> 공공 유기동물 API에서 실시간 조회하는 데이터이므로 DB에 저장하지 않는다. 단, 찜 저장 시점의 핵심 정보는 Favorite 스냅샷으로 저장한다.

```json
{
  "desertionNo": "string (공공 API 고유 ID)",
  "kindCd": "string (축종 코드)",
  "age": "string",
  "weight": "string",
  "noticeEdt": "string (공고 종료일 YYYYMMDD)",
  "careNm": "string (보호소명)",
  "careTel": "string",
  "popfile": "string (이미지 URL)",
  "processState": "string (보호중 | 입양완료 | 방사 | 사망)"
}
```

### Favorite (찜 스냅샷)

```json
{
  "id": "string (cuid)",
  "userId": "string",
  "animalId": "string (desertionNo)",
  "animalKind": "string",
  "animalAge": "string",
  "animalWeight": "string",
  "shelterName": "string",
  "shelterTel": "string",
  "imageUrl": "string | null",
  "kindNm": "string | null",
  "noticeEdt": "string",
  "createdAt": "datetime"
}
```

### Checklist

```json
{
  "id": "string (cuid)",
  "userId": "string",
  "animalId": "string",
  "animalKind": "string",
  "animalAge": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### ChecklistItem

```json
{
  "id": "string (cuid)",
  "checklistId": "string",
  "category": "string (준비물 | 예방접종 | 환경 준비)",
  "content": "string",
  "isChecked": "boolean"
}
```

---

### 3-3. ORM Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String      @id @default(cuid())
  email      String      @unique
  password   String
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  favorites  Favorite[]
  checklists Checklist[]
}

model Favorite {
  id           String   @id @default(cuid())
  userId       String
  animalId     String
  animalKind   String
  animalAge    String
  animalWeight String?
  shelterName  String
  shelterTel   String?
  imageUrl     String?
  kindNm       String?
  noticeEdt    String
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, animalId])
}

model DailyMatchCount {
  id        String   @id @default(cuid())
  ipAddress String
  date      String
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([ipAddress, date])
}

model Checklist {
  id         String          @id @default(cuid())
  userId     String
  animalId   String
  animalKind String
  animalAge  String
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
  items      ChecklistItem[]
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, animalId])
}

model ChecklistItem {
  id          String    @id @default(cuid())
  checklistId String
  category    String
  content     String
  isChecked   Boolean   @default(false)
  checklist   Checklist @relation(fields: [checklistId], references: [id], onDelete: Cascade)
}
```

---

### 3-4. 주요 함수 목록

| 함수명 | 동작 | 입력 | 반환 |
|---|---|---|---|
| `analyzeLifestyle` | 설문 JSON을 Claude API에 전달해 적합 동물 유형·특성·필터 조건 추출 | `SurveyAnswers` | `AnimalRecommendation` |
| `filterAnimals` | 공공 API 호출 + 보호중 상태 필터 + 추천 조건 필터 | `AnimalRecommendation` | `Animal[]` |
| `generateMatchComments` | 동물 목록 전체를 배치로 전달해 감성 코멘트 일괄 생성 | `Animal[], SurveyAnswers` | `Promise<{ desertionNo: string, comment: string }[]>` |
| `generateChecklist` | 동물 종류·나이·특성 기반 체크리스트 생성 | `{ kind: string, age: string }` | `Promise<ChecklistItemInput[]>` |
| `hashPassword` | 비밀번호 bcrypt 해싱 | `string` | `Promise<string>` |
| `verifyPassword` | 비밀번호와 해시 비교 | `string, string` | `Promise<boolean>` |

---

### 3-5. DB 설계 결정 사항

| 결정 | 이유 |
|---|---|
| 유기동물 원본 데이터 DB 미저장 | 공공 API가 실시간 데이터를 제공하므로 DB 동기화 복잡도를 제거하고 실시간 조회로 처리 |
| 찜 목록에 스냅샷 저장 | 공공 API 원본이 입양완료·사망으로 변경·삭제되어도 찜 목록에서 동물 정보를 유지하기 위해 |
| User 테이블 soft delete 미적용 | MVP 범위에서 회원 복구 기능 불필요. 탈퇴 시 hard delete로 단순하게 처리 |
| 비회원 매칭 횟수 쿠키 관리 | 비회원에게 DB row를 생성하지 않고 서버 부하를 최소화하기 위해 |

---

## 4. 폴더 구조

이 프로젝트는 **Next.js App Router 기반 풀스택 단일 프로젝트** 로 구현한다.

```
matchpaw/
├── app/
│   ├── (pages)/                         # 라우트 그룹 — 페이지 레이아웃 공유
│   │   ├── page.tsx                     # 홈 (/)
│   │   ├── survey/page.tsx              # 라이프스타일 설문 (/survey)
│   │   ├── result/page.tsx              # AI 매칭 결과 (/result)
│   │   ├── animals/
│   │   │   ├── page.tsx                 # 유기동물 목록 (/animals)
│   │   │   └── [id]/page.tsx            # 유기동물 상세 (/animals/:id)
│   │   ├── checklist/page.tsx           # AI 입양 체크리스트 (/checklist)
│   │   └── favorites/page.tsx           # 찜 목록 (/favorites) — 회원 전용
│   ├── api/                             # Route Handlers — 서버 전용
│   │   ├── match/route.ts               # POST /api/match
│   │   ├── animals/
│   │   │   ├── route.ts                 # GET /api/animals
│   │   │   └── [id]/route.ts            # GET /api/animals/:id
│   │   ├── checklist/route.ts           # POST /api/checklist
│   │   ├── checklists/
│   │   │   ├── route.ts                 # GET /api/checklists
│   │   │   └── [id]/items/[itemId]/route.ts  # PATCH 체크 상태 업데이트
│   │   ├── favorites/
│   │   │   ├── route.ts                 # GET, POST /api/favorites
│   │   │   └── [id]/route.ts            # DELETE /api/favorites/:id
│   │   └── auth/
│   │       ├── register/route.ts
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       └── me/route.ts
│   ├── layout.tsx                       # 루트 레이아웃
│   └── globals.css
├── components/
│   ├── common/                          # Button, Card, Modal, Skeleton 등 공통 컴포넌트
│   └── features/                        # 기능별 컴포넌트 (survey/, result/, animals/, favorites/)
├── hooks/                               # useAnimals, useMatch, useFavorites 등 커스텀 훅
├── store/                               # Zustand 스토어 (authStore, surveyStore, matchStore)
├── lib/
│   ├── prisma.ts                        # Prisma Client 싱글턴
│   ├── animalApi.ts                     # 공공 유기동물 API 클라이언트
│   ├── claudeApi.ts                     # Claude API 클라이언트
│   └── auth.ts                          # JWT 발급·검증, bcrypt 유틸
├── types/                               # TypeScript 인터페이스·타입 정의
├── prisma/
│   └── schema.prisma                    # DB 스키마 정의
├── .env.example                         # 환경변수 예시
├── next.config.ts
└── package.json
```

### 4-1. 폴더 구조 원칙

- `app/api/`의 Route Handler는 서버 전용이다. 외부 API 호출과 DB 접근은 이 안에서만 수행한다.
- `components/common/`은 특정 기능에 종속되지 않는 재사용 UI 컴포넌트를 담당한다.
- `lib/prisma.ts`는 Prisma Client를 싱글턴으로 관리한다. Next.js 개발 환경에서 Hot Reload 시 인스턴스가 중복 생성되는 문제를 방지하기 위해 global 객체에 캐싱한다.
- `lib/` 내 외부 API 클라이언트는 Route Handler에서만 import한다. Client Component에서 직접 import하면 빌드 에러가 발생한다.

---

## 5. API 설계

### 5-1. 공통 응답 형식

```json
// 성공
{ "success": true, "data": "T" }

// 실패
{ "success": false, "error": { "code": "string", "message": "string" } }
```

---

### 5-2. Route / Endpoint 목록

### 매칭

| Method | Path | 설명 | Auth |
|---|---|---|---|
| POST | `/api/match` | 설문 분석 → 매칭 동물 + 감성 코멘트 반환 | 불필요 (비회원 횟수 쿠키 검사) |

**Request Body**

```json
{
  "survey": {
    "housingType": "원룸",
    "activityLevel": "보통",
    "aloneHours": "8시간 이상",
    "spaceSize": "20평 이하",
    "preferredSize": "소형"
  }
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "animals": [
      {
        "desertionNo": "string",
        "kindCd": "string",
        "age": "string",
        "careNm": "string",
        "popfile": "string",
        "comment": "혼자 있는 시간이 많아도 독립적으로 잘 지내는 아이예요."
      }
    ]
  }
}
```

### 유기동물

| Method | Path | 설명 | Auth |
|---|---|---|---|
| GET | `/api/animals` | 보호중 유기동물 목록 (공공 API 프록시, 필터 지원) | 불필요 |
| GET | `/api/animals/:id` | 유기동물 상세 (공공 API 프록시) | 불필요 |

### 체크리스트

| Method | Path | 설명 | Auth |
|---|---|---|---|
| POST | `/api/checklist` | AI 체크리스트 생성 (회원은 DB 저장 포함) | 불필요 |
| GET | `/api/checklists` | 저장된 체크리스트 목록 조회 | 필요 |
| PATCH | `/api/checklists/:id/items/:itemId` | 체크 항목 완료 상태 업데이트 | 필요 |

### 찜

| Method | Path | 설명 | Auth |
|---|---|---|---|
| GET | `/api/favorites` | 찜 목록 조회 | 필요 |
| POST | `/api/favorites` | 찜 추가 | 필요 |
| DELETE | `/api/favorites/:id` | 찜 삭제 | 필요 |

### 인증

| Method | Path | 설명 | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | 회원가입 | 불필요 |
| POST | `/api/auth/login` | 로그인 + JWT 발급 | 불필요 |
| POST | `/api/auth/logout` | 로그아웃 (쿠키 삭제) | 필요 |
| GET | `/api/auth/me` | 현재 로그인 사용자 정보 조회 | 필요 |

---

### 5-3. 인증 방식 결정

| 항목 | JWT + Bcrypt 직접 구현 | Auth.js (NextAuth v5) |
|---|---|---|
| 구현 복잡도 | 중간 (직접 토큰 발급·검증) | 낮음 (Next.js 통합 추상화 제공) |
| 소셜 로그인 확장 | 직접 구현 필요 | 간단히 추가 가능 |
| MVP 적합성 | 이메일 인증만 구현 시 적합 | 과할 수 있음 |
| 쿠키 제어 | `next/headers`의 `cookies()`로 직접 지정 | 추상화로 내부 로직 불투명 |

**결정**: JWT + Bcrypt 직접 구현. MVP에서 이메일 인증만 구현하므로 단순하게 시작하고, `next/headers`의 `cookies()`로 httpOnly 쿠키를 직접 제어해 XSS 방어에 유리하다.

---

## 6. 핵심 기능 구현 설계

### 6-1. AI 매칭 파이프라인

```
① 클라이언트에서 설문 JSON 전송
      │
② Claude API 호출 #1: 설문 분석
   입력: 설문 5문항 JSON
   출력: { recommendedKind, sizeRange, ageRange, characteristics, precautions }
      │
③ 공공 유기동물 API 호출
   필터: processState="보호중" + recommendedKind + sizeRange + ageRange
   출력: 필터링된 Animal[] (최대 20개)
      │
④ Claude API 호출 #2: 감성 코멘트 배치 생성 (전체 동물 목록 단일 호출)
   입력: Animal[] + 설문 결과
   출력: { desertionNo: string, comment: string }[]
      │
⑤ 최종 응답: { animals: (Animal & { comment: string })[] }
```

> **배치 호출 채택 이유**: 동물 1마리당 1회 호출 시 20마리 = 21 API 호출 발생. Anthropic RPM 제한에 걸릴 가능성이 높다. 전체 목록을 단일 프롬프트 JSON 배열로 전달하면 총 2회 호출로 전체 플로우를 완료할 수 있다.

**실패 처리**

- Claude API 응답 5초 초과 시: 타임아웃 에러 반환, 클라이언트 재시도 안내
- 공공 API 필터링 결과 0건: 빈 배열 반환 + 조건 완화 메시지 포함
- Claude API rate limit 초과: 503 에러 반환, 잠시 후 재시도 안내
- 배치 코멘트 응답 파싱 실패 시: 코멘트 없이 동물 목록만 반환 (graceful degradation)

---

### 6-2. 비회원 매칭 횟수 제한

IP 주소 + 날짜 복합키를 DB에 저장하는 방식으로 구현. 쿠키 기반 방식 대비 시크릿 모드·쿠키 삭제 우회 불가능.

```typescript
// DailyMatchCount 모델 활용
const record = await prisma.dailyMatchCount.upsert({
  where: { ipAddress_date: { ipAddress: ip, date: today } },
  update: { count: { increment: 1 } },
  create: { ipAddress: ip, date: today, count: 1 },
});
if (record.count > DAILY_LIMIT) return 429;
```

IP 추출 순서: `X-Forwarded-For` → `X-Real-IP` → `'0.0.0.0'`

Vercel이 실제 클라이언트 IP를 강제 주입하므로 `X-Forwarded-For` 헤더 스푸핑 우회 불가. VPN·프록시로 IP 변경은 막을 수 없음 (의도적 우회 제외).

```
요청 수신
      │
IP + 오늘 날짜로 DailyMatchCount upsert
      │
count > 2 → 429 응답 (횟수 초과, 로그인 유도)
count ≤ 2 → 매칭 진행
```

---

## 7. 외부 API 연동 설계

### 7-1. API 클라이언트 구조

```typescript
// lib/animalApi.ts
export async function fetchProtectedAnimals(params: AnimalFilterParams): Promise<Animal[]> {
  const res = await fetch(`${ANIMAL_API_URL}?${buildQuery(params)}&serviceKey=${process.env.ANIMAL_API_KEY}`);
  if (!res.ok) throw new Error('공공 유기동물 API 오류');
  const raw = await res.json();
  return normalizeAnimalResponse(raw);
}
// 단건 조회: 공공 API가 desertionNo 단건 필터를 지원하지 않으므로
// 목록(100개)에서 desertionNo로 find하는 방식으로 구현

// lib/claudeApi.ts (실제 구현 — Gemini API 사용)
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = 'gemini-2.5-flash-lite';

export async function analyzeMatch(req: ClaudeMatchRequest): Promise<ClaudeMatchResponse> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: '...JSON schema 정의...',
    generationConfig: { responseMimeType: 'application/json' },
  });
  const result = await model.generateContent(JSON.stringify(req));
  return JSON.parse(result.response.text());
}

export async function generateChecklist(req: ClaudeChecklistRequest): Promise<ClaudeChecklistResponse> {
  // 동일 패턴으로 구현
}
```

---

### 7-2. 응답 캐싱 전략

| API | 캐싱 전략 | 이유 |
|---|---|---|
| 공공 유기동물 목록 | TanStack Query staleTime: 5분 | 보호 상태가 자주 변경되지 않으므로 5분 캐싱으로 불필요한 호출 절감 |
| Gemini API 매칭 결과 | 캐싱 없음 (설문 응답마다 고유) | 설문 조합이 다양해 캐싱 효율이 낮음 |
| Gemini API 체크리스트 | DB 저장 (회원) / 캐싱 없음 (비회원) | 회원은 DB에서 재조회, 비회원은 세션 내 재생성. 가장 최근 1개만 표시 |

---

### 7-3. 에러 처리 원칙

```
외부 API 실패
  ├── 공공 유기동물 API 실패 → 500 에러 응답, "잠시 후 다시 시도해주세요" 안내
  └── Gemini API 실패      → try/catch로 502 에러 응답, 재시도 버튼 표시
```

---

## 8. 상태 관리 설계

### 8-1. 클라이언트 상태 관리 (Zustand)

```typescript
// store/surveyStore.ts
interface SurveyStore {
  answers: SurveyAnswers | null;
  setAnswers: (answers: SurveyAnswers) => void;
  reset: () => void;
}

// store/matchStore.ts
interface MatchStore {
  result: MatchResult | null;
  setResult: (result: MatchResult) => void;
}

// store/authStore.ts
interface AuthStore {
  user: { id: string; email: string } | null;
  setUser: (user: { id: string; email: string } | null) => void;
}
```

---

### 8-2. 서버 상태 관리 (TanStack Query)

| Query Key | 설명 |
|---|---|
| `['animals', filterParams]` | 유기동물 목록 (필터 조건별 캐시) |
| `['animal', id]` | 유기동물 상세 |
| `['favorites']` | 찜 목록 (회원) |
| `['checklists']` | 저장된 체크리스트 목록 (회원) |

---

## 9. 인증 및 보안

### 9-1. 비밀번호 보안

```typescript
// lib/auth.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
```

---

### 9-2. 토큰 처리

```typescript
// JWT 페이로드 예시
{ userId: string, email: string, iat: number, exp: number }

// 만료 시간: 7일
// 저장 위치: httpOnly + Secure + SameSite=Lax 쿠키
```

---

### 9-3. API 인증 처리

```typescript
// Route Handler에서 공통으로 사용하는 인증 패턴 (next/headers 활용)
import { cookies } from 'next/headers';

async function requireAuth(): Promise<{ userId: string; email: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) throw new UnauthorizedError();
  return verifyToken(token);
}
```

---

## 10. 환경변수 목록

```bash
# .env.example

# DB (Neon — Vercel 통합 시 자동 주입)
DATABASE_URL=

# Auth
JWT_SECRET=

# 공공 유기동물 API (농림축산검역본부)
ANIMAL_API_KEY=

# Google Gemini API (Claude API 대체 — 무료 티어 이용)
GEMINI_API_KEY=
```

> ⚠️ 모든 키는 서버 전용 환경변수로 관리한다. `NEXT_PUBLIC_` 접두사 키는 사용하지 않는다. Vercel 대시보드의 Environment Variables에 등록한다.

---

## 11. 주요 기술 결정 및 트레이드오프

| 결정 | 선택 | 대안 | 이유 |
|---|---|---|---|
| 아키텍처 | Next.js 풀스택 단일 프로젝트 | React + Express 분리 | FE·BE·배포를 단일 프로젝트로 통합. CORS 설정·별도 서버 배포 불필요. Vercel 단일 배포로 관리 포인트 최소화 |
| DB 호스팅 | Neon | Supabase / Railway | 순수 PostgreSQL만 필요한 구조에서 Supabase의 Auth·Storage 등 부가 기능은 불필요. Neon은 Vercel 공식 통합으로 환경변수 자동 주입 가능 |
| 인증 방식 | JWT + Bcrypt 직접 구현 | Auth.js (NextAuth v5) | MVP에서 이메일 인증만 구현하므로 단순하게 시작. `next/headers cookies()`로 httpOnly 쿠키 직접 제어 |
| AI API | Google Gemini API (`gemini-2.5-flash-lite`) | Claude API (Anthropic) | Claude API 무료 티어 없음, 크레딧 소진. Gemini API 무료 티어로 전환 (`@google/generative-ai`) |
| 유기동물 데이터 처리 | 실시간 API 조회 | DB 주기적 동기화 | 공공 API 자동승인 실시간 제공. DB 동기화 복잡도 없이 처리 |
| 찜 데이터 저장 | 스냅샷 저장 (imageUrl·kindNm 포함) | 원본 API desertionNo만 FK로 저장 | 공공 API 원본이 삭제되어도 찜 목록에서 사진·품종명 표시 가능하도록 |
| 감성 코멘트 생성 | 배치 단일 호출 | 동물 1마리당 1회 호출 | 배치 호출로 API 호출 횟수 최소화 |
| 비회원 횟수 제한 | IP + 날짜 복합키 DB 저장 | 쿠키 기반 카운트 | 시크릿 모드·쿠키 삭제 우회 방지. Vercel이 X-Forwarded-For 스푸핑 차단 |
| Prisma 버전 | Prisma 5.22.0 | Prisma 7 (최신) | Prisma 7 breaking change(schema.prisma url 제거)로 인한 마이그레이션 이슈. 5 버전으로 다운그레이드 |

---

## 12. 리스크 및 대응 방안

| 리스크 | 가능성 | 영향도 | 대응 방안 |
|---|---|---|---|
| 공공 유기동물 API 일일 호출 제한 초과 | 中 | 高 | TanStack Query staleTime 5분 설정으로 호출 절감. 초과 시 에러 안내 표시 |
| Gemini API 응답 지연 | 中 | 中 | Route Handler에서 try/catch 처리. 실패 시 502 응답 + 클라이언트 재시도 버튼 |
| 공공 API 보호 상태 지연 반영 | 低 | 中 | 서버 측 "보호중" 필터 적용. 상세 페이지에서 현재 상태 재조회 |
| Vercel 서버리스 함수 실행 시간 제한 (기본 10초) | 中 | 中 | AI 매칭 파이프라인 총 실행 시간 모니터링. 필요 시 `maxDuration` 설정 조정 |

---

## 13. 미결 사항 (Open Questions)

| # | 항목 | 결정 |
|---|---|---|
| OQ-01 | AI 모델 선택 | **결정**: Google Gemini API (`gemini-2.5-flash-lite`) 채택. Claude API 무료 티어 없음으로 전환 |
| OQ-02 | 공공 유기동물 API 일일 호출 한도 | **결정**: 공공 API 10,000건/일 제한. TanStack Query staleTime 5분으로 호출 절감 |
| OQ-03 | 비교 테이블 기능 | **결정**: MVP 범위 제외. 찜 목록에 사진·품종명·날짜 표시로 대체 |
