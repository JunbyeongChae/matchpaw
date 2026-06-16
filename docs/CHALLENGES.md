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

## CH-06. 비밀번호 찾기 — 보안 표준 vs UX 의도적 선택

**날짜**: 2026-06-16
**Phase**: 버그픽스
**난이도**: 하

### Problem
`/api/auth/forgot-password`에서 가입되지 않은 이메일을 입력하면 `USER_NOT_FOUND` 에러와 함께 "가입되지 않은 이메일입니다." 메시지를 반환하고 있었다. 이것이 **계정 열거 공격(Account Enumeration Attack)** 을 허용한다는 보안 지적이 들어왔다. 공격자가 이메일 목록을 대입해 어느 이메일이 실제로 가입돼 있는지 파악할 수 있다는 것이 지적의 근거였다.

### Tried
OWASP 표준 권고안은 계정 존재 여부와 무관하게 "이메일이 가입된 경우 링크를 발송했습니다." 형태의 동일한 응답을 돌려주는 **silent success** 패턴이다.

### Solution
**의도적으로 현재 방식을 유지하기로 결정했다.**

도메인 특성을 고려한 판단이었다. matchpaw는 유기동물 입양 플랫폼으로, 금융·의료처럼 "이 사람이 가입했는지"가 민감 정보인 서비스가 아니다. 계정 열거 공격의 실질적 피해 위험이 낮고, 이메일을 잘못 입력했을 때 즉시 피드백을 받을 수 있는 UX 이점이 더 크다고 판단했다.

실제로 Gmail, Kakao 등 대형 서비스도 동일한 UX 선택을 하고 있다.

### Lesson
보안 권고사항은 서비스 도메인과 실질적 위험도를 함께 고려해야 한다. "OWASP 표준이니까 무조건 따른다"가 아니라 트레이드오프를 분석하고 **근거 있는 결정**을 내리는 것이 중요하다. 면접에서 "왜 silent success를 선택하지 않았나?"에 대해 도메인 특성, UX 우선순위, 실질적 리스크 분석을 근거로 답변할 수 있다.

---

## CH-05. 유기동물 목록 중복 카드 — 공공 API 자체 중복 응답 미처리

**날짜**: 2026-06-16
**Phase**: 버그픽스
**난이도**: 하

### Problem
유기동물 목록 페이지에서 동일한 동물 카드가 여러 장 반복 노출됐다. `key={animal.desertionNo}`로 렌더링하고 있어 React key 경고도 발생했다.

### Tried
- 프론트엔드 렌더링 로직, 페이지네이션, TanStack Query 캐시 순서로 확인 → 이상 없음
- 공공 유기동물 API 응답을 직접 확인 → 동일한 `desertionNo`를 가진 항목이 하나의 응답 안에 중복 포함되어 있음

### Solution
`lib/animalApi.ts`의 `fetchAnimalList`에서 API 응답 정규화 직후 `Set`으로 `desertionNo` 기준 중복 제거.

```typescript
const seen = new Set<string>();
const items = normalized.filter((a) => {
  if (seen.has(a.desertionNo)) return false;
  seen.add(a.desertionNo);
  return true;
});
```

### Lesson
외부 공공 API의 응답 데이터 품질을 신뢰할 수 없다. API 클라이언트 레이어(`lib/`)에서 데이터를 받는 즉시 정규화·중복 제거를 수행해야 한다. 특히 공공 데이터 포털 API는 중복, 누락, 형식 불일치가 빈번하므로 방어적으로 처리하는 습관이 필요하다.

---

## CH-04. Rate Limit 날짜 — UTC 기준으로 한국 시간과 최대 9시간 차이

**날짜**: 2026-06-15
**Phase**: 버그픽스
**난이도**: 하

### Problem
비회원 매칭 횟수를 날짜별로 제한할 때 `new Date().toISOString().slice(0, 10)`으로 날짜 키를 생성했다. `toISOString()`은 UTC 기준이므로 한국 시각 오전 9시 이전(UTC 전날)에는 날짜 키가 전날로 계산된다. 예: 한국 시각 2026-06-15 오전 8:59 → UTC 2026-06-14로 저장. 전날 2회를 이미 사용한 사용자가 당일 오전 9시 이전에 다시 2회를 사용할 수 있는 버그.

### Solution
`Intl.DateTimeFormat`에 `timeZone: 'Asia/Seoul'`을 지정하고 `en-CA` 로케일로 `YYYY-MM-DD` 형식을 직접 반환.

```typescript
function getToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
}
```

`en-CA`는 ISO 8601 형식(`YYYY-MM-DD`)을 반환하므로 별도 파싱 없이 DB 키로 바로 사용 가능.

### Lesson
서버가 UTC 환경(Vercel)이어도 서비스 기준 시간대를 명시해야 한다. `toISOString()`은 항상 UTC이므로 특정 시간대의 "오늘"을 구할 때는 `Intl.DateTimeFormat`이나 UTC 오프셋 계산이 필요하다. 날짜 기반 비즈니스 로직은 항상 시간대를 명시하는 습관을 들여야 한다.

---

## CH-03. 비회원 매칭 횟수 제한 — IP 기반 구현과 우회 가능성 분석

**날짜**: 2026-06-15
**Phase**: Phase 5
**난이도**: 중

### Problem
비회원도 AI 매칭을 체험할 수 있되, 무제한 사용을 방지해야 했다. 로그인 없이 사용자를 식별하고 하루 사용 횟수를 제한하는 방법이 필요했다.

### Solution
**IP 주소 + 날짜 복합키** 기반으로 DB에 카운트를 저장하는 방식을 선택했다.

```typescript
// DailyMatchCount 모델: ipAddress + date 복합 유니크 키
const record = await prisma.dailyMatchCount.upsert({
  where: { ipAddress_date: { ipAddress: ip, date: today } },
  update: { count: { increment: 1 } },
  create: { ipAddress: ip, date: today, count: 1 },
});
if (record.count > DAILY_LIMIT) return 429;
```

IP는 `X-Forwarded-For` → `X-Real-IP` → `0.0.0.0` 순으로 추출한다.

**막을 수 있는 우회:**
- 시크릿/인코그니토 모드 → 같은 IP이므로 제한 적용
- 브라우저 캐시·쿠키 삭제 → 서버 DB 기반이므로 우회 불가
- `X-Forwarded-For` 헤더 스푸핑 → Vercel이 실제 클라이언트 IP를 강제 주입하고 사용자 제공 헤더를 무시하므로 우회 불가

**남은 우회 방법 (현실적으로 막기 불가능):**
- VPN / 프록시 서버로 IP 변경
- 모바일 데이터 ↔ WiFi 전환 (IP 변경)
- 다른 네트워크 환경으로 이동

### Lesson
IP 기반 제한은 "선의의 사용자"에 대한 가이드라인 수준이며, 악의적인 우회는 막기 어렵다. 완전한 제한은 계정 기반(로그인 필수)으로만 가능하다. 그러나 포트폴리오 프로젝트처럼 체험 목적의 비회원 기능에서는 IP 제한만으로 충분하고, 이 한계를 인지하고 설계했다는 점을 면접에서 어필할 수 있는 포인트다.

---

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
