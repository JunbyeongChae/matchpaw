# Git 전략 (개인 프로젝트)

이 문서는 개인 프로젝트를 진행하면서 Branch, Commit, Pull Request를 일관되게 사용하기 위한 규칙입니다.

## 1. 기본 원칙

- `main` 브랜치는 항상 실행 가능한 상태로 유지합니다.
- 작업 브랜치를 따로 만들어 작업하고, `main`에 병합합니다.
- `main` 브랜치에 직접 push하지 않습니다.
- 하나의 작업은 가능한 하나의 명확한 단위로 나눕니다.

## 2. 브랜치 전략

이 프로젝트는 GitHub Flow를 사용합니다.

```
main
└─ feature/작업명
└─ fix/작업명
└─ refactor/작업명
└─ docs/작업명
└─ chore/작업명
```

`develop`, `release`, `hotfix` 브랜치를 별도로 운영하는 Git Flow는 사용하지 않습니다.

## 3. 브랜치 네이밍 규칙

브랜치명은 아래 형식을 따릅니다.

```
type/short-description
```

예시:

```
feature/login-page
feature/signup-api
fix/header-layout
refactor/button-component
style/main-layout
docs/readme-update
chore/project-setting
```

## 4. 작업 타입

| Type | 사용 상황 |
| --- | --- |
| `feature` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변화 없는 코드 구조 개선 |
| `style` | UI, CSS, 레이아웃 수정 |
| `docs` | 문서 추가 또는 수정 |
| `chore` | 설정, 패키지, 빌드 환경 등 기타 작업 |

## 5. Commit 메시지 규칙

커밋 메시지는 아래 형식을 따릅니다.

```
type: 작업 내용
```

예시:

```
feat: 로그인 페이지 구현
fix: 모바일 헤더 레이아웃 수정
refactor: Button 컴포넌트 구조 정리
docs: README 실행 방법 추가
chore: ESLint 설정 추가
```

커밋 타입은 다음 기준을 사용합니다.

| Commit Type | 의미 |
| --- | --- |
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | UI/CSS 수정 |
| `docs` | 문서 수정 |
| `chore` | 설정 및 기타 작업 |

> **브랜치 타입과의 표기 차이**
> 브랜치명에는 `feature`를 사용하고, 커밋 메시지에는 Conventional Commits 관례에 따라 `feat`를 사용합니다.
> 나머지 타입(`fix`, `refactor`, `style`, `docs`, `chore`)은 브랜치·커밋 모두 동일하게 사용합니다.

## 6. Pull Request 규칙

작업이 끝나면 Pull Request를 생성합니다.

PR 제목은 아래 형식으로 작성합니다.

```
[type] 작업 제목
```

PR 제목 예시:

```
[feature] 로그인 페이지 구현
[fix] 모바일 헤더 레이아웃 수정
[refactor] Button 컴포넌트 구조 정리
[docs] README 실행 방법 추가
[chore] 프로젝트 초기 설정
```

PR 본문에는 아래 내용을 작성합니다.

- 작업 내용
- 확인 방법
- 스크린샷 또는 참고 자료

## 7. 병합 전 셀프 체크리스트

병합하기 전에 아래 항목을 스스로 확인합니다.

- [ ] 의도한 작업을 모두 완료했는가
- [ ] `console.log`, 디버깅 코드, 주석 처리된 불필요한 코드를 제거했는가
- [ ] 로컬에서 정상 동작을 직접 확인했는가
- [ ] UI 변경이 있다면 화면이 깨지지 않는가

## 8. Merge 규칙

- 충돌이 발생하면 직접 해결한 뒤 병합합니다.
- 병합 후 사용하지 않는 작업 브랜치는 삭제합니다.
- 병합 방식은 기본적으로 `Squash and merge`를 권장합니다.

`Squash and merge`를 사용하면 여러 개의 작업 커밋을 하나의 커밋으로 정리해 `main` 브랜치의 히스토리를 깔끔하게 유지할 수 있습니다.

### 8.1 충돌 해결 절차

충돌이 발생하면 아래 순서로 해결합니다.

```
1. 최신 main을 로컬에 pull 받습니다.
   git checkout main
   git pull origin main

2. 작업 브랜치로 이동해 main을 rebase합니다.
   git checkout feature/login-page
   git rebase main

3. 충돌 파일을 열어 직접 수정합니다.
   - <<<<<<, =======, >>>>>>> 마커를 제거하고 올바른 코드로 정리합니다.

4. 충돌 해결 후 rebase를 계속 진행합니다.
   git add .
   git rebase --continue

5. 원격 브랜치에 force push합니다.
   git push origin feature/login-page --force-with-lease
```

> **rebase를 사용하는 이유**
> `merge` 대신 `rebase`를 사용하면 불필요한 Merge 커밋 없이 히스토리를 선형으로 유지할 수 있습니다.

## 9. 작업 흐름 요약

```
1. 작업 브랜치 생성
2. 작업 진행
3. Commit 작성
4. 원격 브랜치에 Push
5. Pull Request 생성
6. 셀프 체크 후 main에 Merge
7. 작업 브랜치 삭제
```

## 10. 예시 흐름

로그인 페이지를 구현하는 경우:

```
1. Branch 생성
   feature/login-page

2. Commit 작성
   feat: 로그인 페이지 UI 구현

3. PR 생성
   [feature] 로그인 페이지 구현

4. 셀프 체크 후 main에 병합
```

## 11. 주의사항

- 작업 전에 항상 최신 `main` 브랜치를 pull 받습니다.
- 큰 작업은 작은 단위로 나눠서 진행합니다.
- GitHub에 남기는 기록은 포트폴리오의 근거가 되므로, 커밋과 PR 제목을 명확하게 작성합니다.
