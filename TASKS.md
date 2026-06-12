# matchpaw — 작업 현황

> 현재 Phase와 작업 목록을 순서대로 관리한다.
> 작업을 시작하면 `[ ]` → `[~]`, 완료하면 `[~]` → `[x]`로 바꾼다.
>
> - `[ ]` 대기
> - `[~]` 진행 중
> - `[x]` 완료

---

## 현재 단계: Phase 1 — 타입 정의 및 외부 API 검증 (6/12~13)

### TODO


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
