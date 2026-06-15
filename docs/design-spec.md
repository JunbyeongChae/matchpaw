# matchpaw — 디자인 스펙

> Figma 1회 추출 기준 (2026-06-15). 이후 구현 시 Figma 재호출 없이 이 문서를 참조한다.
> Figma 파일: `tqEzICPxI9GYKb8ytoA5Sn` / 디자인된 화면: Home Screen (390px 모바일 기준)

---

## 컬러 팔레트

| 토큰명 | Hex | 용도 |
|---|---|---|
| `brand-primary` | `#FF8C42` | Primary CTA 버튼, FAB, Active 네비 배경 |
| `brand-deep` | `#6A2D00` | Primary 버튼 위 텍스트 |
| `brand-secondary` | `#9B4500` | 헤더 로고, 브랜드 텍스트, 링크 |
| `surface-page` | `#FFF8F4` | 페이지 배경, 헤더 배경 |
| `surface-card` | `#FFFFFF` | 카드, 바텀 네비 배경 |
| `surface-hero` | `#FFF1E7` | 히어로 섹션 배경 |
| `surface-warm` | `#FFEEE0` | 보조 배경 |
| `surface-peach` | `#FDEBDC` | 옵션 배경 |
| `surface-beige` | `#F7E5D7` | 필터/태그 배경 |
| `surface-muted` | `#E5E2DE` | 비활성 배경, Step 3 아이콘 배경 |
| `text-primary` | `#231A11` | 주요 제목 |
| `text-body` | `#564338` | 본문, 설명 텍스트 |
| `text-muted` | `#605E5B` | 비활성 네비 레이블, 보조 텍스트 |
| `text-subtle` | `#666461` | 더 연한 보조 텍스트 |
| `text-dark` | `#484744` | 중간 어두운 텍스트 |
| `text-brand` | `#9B4500` | 브랜드 색 텍스트 |
| `text-deep-brown` | `#392F25` | 다크 모달 배경 등 |
| `border-default` | `#DDC1B3` | 기본 보더/구분선 |
| `border-subtle` | `#E5E7EB` | 카드 내부 구분선 |
| `badge-dog-bg` | `#FFDBC9` | 강아지 뱃지 배경 |
| `badge-dog-text` | `#763300` | 강아지 뱃지 텍스트 |
| `badge-cat-bg` | `#BAEBF1` | 고양이 뱃지 배경 |
| `badge-cat-text` | `#1B4E52` | 고양이 뱃지 텍스트 |
| `teal` | `#36666B` | 고양이 아이콘 컬러 |
| `error` | `#BA1A1A` | 오류 상태 |
| `avatar-bg` | `#F1DFD1` | 프로필 아바타 배경 |

---

## 타이포그래피

### 폰트 패밀리

| 패밀리 | 용도 |
|---|---|
| **IBM Plex Mono** | 본문, UI 레이블, 버튼, 카드 정보 — 디자인의 주력 폰트 |
| **Plus Jakarta Sans** | 섹션 제목, 브랜드 헤더 |
| **Be Vietnam Pro** | 뱃지, 소형 레이블 (DOG/CAT 등) |

### 텍스트 스케일

| 역할 | 폰트 | Weight | Size | Line-height | 비고 |
|---|---|---|---|---|---|
| Hero H1 | IBM Plex Mono | 500 | 48px | 56px | letter-spacing -2% |
| Brand Logo | Plus Jakarta Sans | 600 | 24px | 32px | letter-spacing -2.5% |
| Section Heading | Plus Jakarta Sans | 600 | 24px | 32px | |
| Section Heading Bold | Plus Jakarta Sans | 700 | 24px | 32px | |
| H2 Large | Plus Jakarta Sans | 700 | 28px | 36px | |
| H2 XL | Plus Jakarta Sans | 700 | 32px | 40px | |
| Mono Heading | IBM Plex Mono | 500 | 28px | 36px | |
| Card Title (동물명) | IBM Plex Mono | 500 | 24px | 32px | |
| Subheading | IBM Plex Mono | 500 | 18px | 28px | |
| Body / Info | IBM Plex Mono | 500 | 16px | 24px | |
| Button / Step Title | IBM Plex Mono | 500 | 14px | 20px | center |
| Nav Label | IBM Plex Mono | 500 | 14px | 20px | |
| Step Card Body | IBM Plex Mono | 500 | 12px | 16px | |
| Badge Label | Be Vietnam Pro | 600 | 14px | 20px | UPPERCASE, 10% letter-spacing |
| DOG/CAT Badge | Be Vietnam Pro | 700 | 10px | 24px | UPPERCASE, 5% letter-spacing |
| Small Label | Be Vietnam Pro | 400 | 12px | 16px | |
| XS Label | Be Vietnam Pro | 400 | 10px | 15px | |

---

## 그림자 (Shadow)

| 용도 | 값 |
|---|---|
| 카드 | `0px 4px 20px 0px rgba(74, 63, 53, 0.06)` |
| FAB / Primary 버튼 강조 | `0px 8px 30px 0px rgba(255, 140, 66, 0.3)` |
| CTA 버튼 | `0px 4px 20px 0px rgba(255, 140, 66, 0.2)` |
| 바텀 네비 | `0px -4px 20px 0px rgba(74, 63, 53, 0.06)` |
| 모달 | `0px 25px 50px -12px rgba(0, 0, 0, 0.25)` |

---

## 레이아웃

| 항목 | 값 |
|---|---|
| 기준 너비 (모바일) | 390px |
| 가로 패딩 (페이지) | 20px |
| 헤더 높이 | 64px |
| 바텀 네비 높이 | ~77.5px |
| 카드 border-radius | 16px |
| 버튼 border-radius (pill) | 9999px |
| FAB border-radius | 9999px |
| 카드 간격 | 16px gap |
| 섹션 간격 | 24–64px gap |

---

## 컴포넌트 스펙

### BottomNavBar
- 배경: `#FFFFFF`, border-radius: `16px 16px 0 0`
- 그림자: `0px -4px 20px 0px rgba(74, 63, 53, 0.06)`
- 네비 항목: Home(홈, active), 유기동물, 체크리스트, 찜 목록
- Active 상태: `#FF8C42` 배경 pill, 아이콘 `#6A2D00`
- Inactive 상태: 텍스트 `#605E5B`, 아이콘 `#605E5B`

### Header (TopAppBar)
- 배경: `#FFF8F4`
- 로고 텍스트: "matchpaw", Plus Jakarta Sans 600/24px, 색상 `#9B4500`
- 우측: 알림 버튼(아이콘) + 프로필 아바타 (배경 `#F1DFD1`, 보더 `#DDC1B3`)

### FAB (매칭 시작 버튼)
- 우하단 고정, 배경 `#FF8C42`, 아이콘 `#6A2D00`
- 그림자: `0px 8px 30px 0px rgba(255, 140, 66, 0.3)`

### Hero Section
- 배경: `#FFF1E7`, border-radius: 16px
- H1: IBM Plex Mono 500/48px, 색상 `#231A11`
- 서브텍스트: IBM Plex Mono 500/18px, 색상 `#564338`
- CTA 버튼: "매칭 시작하기", `#FF8C42` 배경, `#6A2D00` 텍스트

### 동물 카드 (Animal Card)
- 배경: `#FFFFFF`, border-radius: 16px
- 그림자: `0px 4px 20px 0px rgba(74, 63, 53, 0.06)`
- 이미지 영역: border-radius `16px 16px 0 0`
- 찜 버튼: 우상단 absolute, pill, 반투명 배경
- 동물명: IBM Plex Mono 500/24px, `#231A11`
- DOG 뱃지: 배경 `#FFDBC9`, 텍스트 `#763300`
- CAT 뱃지: 배경 `#BAEBF1`, 텍스트 `#1B4E52`
- 종류·나이: IBM Plex Mono 500/16px, `#564338`
- 보호소명: IBM Plex Mono 500/16px, `#564338`, opacity 0.7

### Step 카드
- 배경: `#FFFFFF`, border-radius: 16px, 그림자 동일
- Step 1 아이콘 배경: `#FFDBC9`
- Step 2 아이콘 배경: `#BAEBF1`
- Step 3 아이콘 배경: `#E5E2DE`
- 제목: IBM Plex Mono 500/14px, `#231A11`
- 설명: IBM Plex Mono 500/12px, `#564338`

---

## 화면 목록 (Figma 기준)

Figma에는 **Home Screen** 1개만 디자인되어 있음.
나머지 화면(설문, 결과, 동물목록/상세, 체크리스트, 찜목록, 인증 모달)은 위 디자인 토큰과 컴포넌트 스펙을 기반으로 일관성 있게 구현한다.
