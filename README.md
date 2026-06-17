# matchpaw 🐾

유기동물 입양 AI 매칭 플랫폼. 라이프스타일 설문 5문항을 기반으로 AI가 나에게 맞는 유기동물을 추천하고 입양 체크리스트를 생성합니다.

**배포 URL**: https://matchpaw.vercel.app/

---

## 주요 기능

- **AI 매칭**: 생활 공간, 활동량, 반려동물 경험 등 5가지 설문 → Gemini AI가 공공 유기동물 데이터 분석 → 맞춤 동물 추천 (점수 + 감성 코멘트 + 매칭 이유)
- **AI 체크리스트**: 특정 동물 상세 페이지에서 버튼 클릭 → 해당 동물 맞춤 입양 준비 체크리스트 자동 생성
- **유기동물 목록/상세**: 국가동물보호정보시스템 공공 API 실시간 연동, 종류 필터, 페이지네이션
- **찜 기능**: 관심 동물 저장 (로그인 필요)
- **회원 인증**: JWT + bcrypt, httpOnly 쿠키 기반

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 App Router (TypeScript) |
| 스타일 | Tailwind CSS v4 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| ORM | Prisma 5 |
| DB | PostgreSQL (Neon) |
| 인증 | JWT + bcrypt (httpOnly 쿠키) |
| AI | Google Gemini API (`gemini-2.5-flash-lite`) |
| 공공 API | 국가동물보호정보시스템 v2 |
| 배포 | Vercel |

---

## 로컬 실행

```bash
# 패키지 설치
npm ci

# 환경변수 설정
cp .env.example .env.local
# .env.local에 아래 값 입력

# DB 스키마 반영
npx prisma db push

# 개발 서버 실행
npm run dev
```

### 환경변수

```bash
DATABASE_URL=        # Neon PostgreSQL 연결 문자열
JWT_SECRET=          # 랜덤 32자 이상 문자열
ANIMAL_API_KEY=      # 국가동물보호정보시스템 API 키 (data.go.kr)
GEMINI_API_KEY=      # Google AI Studio API 키 (aistudio.google.com)
```

---

## 아키텍처

```
클라이언트 (React)
  └─ TanStack Query / Zustand
       └─ Next.js Route Handler (서버 전용)
            ├─ Prisma → Neon PostgreSQL
            ├─ Gemini API (AI 매칭/체크리스트)
            └─ 공공 유기동물 API
```

- 외부 API 키는 Route Handler에서만 사용 (클라이언트 노출 없음)
- Prisma Client는 `lib/prisma.ts` 싱글턴으로 관리
- 비회원 매칭 일 2회 제한: IP + 날짜 복합키로 DB 카운트

---

## 개발 기간

2026-06-11 ~ 2026-06-18 (7일, 개인 포트폴리오)
