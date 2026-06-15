# 개발 챌린지 로그 — matchpaw

> 개발 중 막혔던 문제와 해결 과정을 기록한다.
> 포트폴리오용 "어려웠던 점 & 해결 과정" 소재로 활용한다.
>
> **작성 방법**: 문제를 마주치면 바로 기록하고, 해결 후 Solution과 Lesson을 채운다.

---

<!-- 아래 템플릿을 복사해서 새 챌린지를 추가한다 -->
<!--
## CH-XX. 제목

**날짜**: YYYY-MM-DD
**Phase**: Phase X
**난이도**: 상 / 중 / 하

### Problem
무슨 문제가 발생했는가? 어떤 상황이었는가?

### Tried
어떻게 접근했는가? 어떤 것들을 시도했는가?

### Solution
최종적으로 어떻게 해결했는가?

### Lesson
이 경험에서 얻은 인사이트. 포트폴리오에서 강조할 포인트.
-->

## CH-02. 체크리스트 중복 표시 — 정적→AI 전환 중 DB 잔존 데이터

**날짜**: 2026-06-15
**Phase**: Phase 4
**난이도**: 하

### Problem
AI 체크리스트 생성이 안 되는 상황에서 임시로 정적(하드코딩) 체크리스트로 교체해 테스트했다. 이후 AI 방식으로 되돌렸더니 체크리스트 페이지에 기존 정적 체크리스트 2개가 AI 체크리스트와 함께 중복으로 표시됐다.

### Tried
- 코드를 AI 방식으로 되돌렸지만 DB에 이미 저장된 레코드는 그대로 남아있어 페이지에 계속 노출됐다.

### Solution
Prisma를 통해 테스트 중 생성된 정적 체크리스트 레코드(id 1, 2)를 직접 삭제.

```
prisma.checklist.deleteMany({ where: { id: { in: [1, 2] } } })
```

### Lesson
개발 중 구현 방식을 바꿔가며 테스트하면 DB에 더미 데이터가 쌓인다. 임시 구현으로 생성한 데이터는 되돌리기 전에 먼저 정리하거나, 개발 중에는 별도 테스트 DB를 사용하는 것이 안전하다.

---

## CH-01. Prisma 7 Breaking Change — datasource url 제거

**날짜**: 2026-06-12
**Phase**: Phase 0
**난이도**: 중

### Problem
`npm install prisma`로 최신 버전(7.8.0)이 설치됐고, `schema.prisma`에 `url = env("DATABASE_URL")`을 작성했더니 `prisma db push` 실행 시 에러 발생.

```
Error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
```

Prisma 7에서 `schema.prisma`의 `datasource.url`이 완전히 제거된 breaking change였다.

### Tried
- `prisma.config.ts` 생성 + `defineConfig`의 `migrate.adapter`에 `@prisma/adapter-neon`, `@neondatabase/serverless` 연결
- `schema.prisma`에서 `url` 제거 후 재시도 → `"datasource.url property is required in your Prisma config file when using prisma db push"` 에러 지속
- Prisma 7의 `defineConfig` 타입이 요구하는 정확한 URL 설정 방식이 문서화가 부족하여 해결 불가

### Solution
Prisma 5.22.0으로 다운그레이드. `schema.prisma`에 `url = env("DATABASE_URL")` 복원, `lib/prisma.ts`도 기본 `PrismaClient()` 패턴으로 단순화.

### Lesson
포트폴리오처럼 일정이 촉박한 프로젝트에서는 "최신 버전 = 좋음"이 아니다. Major 버전 업그레이드는 breaking change 위험이 크고, 레퍼런스와 Stack Overflow 답변도 부족하다. 사용 전 릴리즈 노트의 breaking changes 항목을 먼저 확인하는 습관이 필요하다.
