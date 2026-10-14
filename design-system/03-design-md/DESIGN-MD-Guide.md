# DESIGN.md 작성 가이드

> **참고**: [Google Labs DESIGN.md Spec](https://github.com/google-labs-code/design.md)
> **한국 디자인 시스템 카탈로그**: https://www.getdesign.kr

---

## 목차

1. [DESIGN.md란?](#designmd란)
2. [파일 구조](#파일-구조)
3. [필수 항목](#필수-항목)
4. [선택 항목](#선택-항목)
5. [마크다운 본문 섹션](#마크다운-본문-섹션)
6. [Do's and Don'ts](#dos-and-donts)
7. [실전 템플릿](#실전-템플릿)

---

## DESIGN.md란?

DESIGN.md는 **AI 코딩 에이전트에게 디자인 시스템을 설명하는 마크다운 파일**입니다.

- README.md = 프로젝트 설명
- **DESIGN.md = 프로젝트 디자인 시스템**

### 핵심 차이점

| 구분 | 토큰 (JSON/YAML) | DESIGN.md |
|------|------------------|-----------|
| 역할 | "어떤 값이 있는지" | "언제 써야 하고, 언제 쓰면 안 되는지" |
| 형식 | 기계 판독 | 기계 + 인간 판독 |
| 내용 | 값만 | 값 + 정책 + 의도 + 제약 |

---

## 파일 구조

DESIGN.md는 **2개의 레이어**로 구성됩니다.

### 1. YAML 프론트매터 (상단)

```yaml
---
version: "alpha"
name: "My Design System"
description: "프로젝트 설명"

colors:
  primary: "#256EF4"
  # ...

typography:
  body:
    fontFamily: "Pretendard"
    fontSize: "17px"
    # ...

spacing:
  sm: "8px"
  # ...

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    # ...
---
```

### 2. 마크다운 본문 (하단)

```markdown
## Overview
브랜드 성격, 타겟, 무드 설명

## Colors
색상 팔레트 및 사용 가이드

## Typography
폰트, 위계, 사용 규칙
# ...
```

---

## 필수 항목

### YAML 프론트매터 필수 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | **필수**. 디자인 시스템 이름 |

### 최소 필수 토큰 (디자인 시스템 부재 시)

디자인 시스템이 없을 때 반드시 정의해야 할 최소 토큰:

#### 1. 색상 (Color) - 5개

| 토큰 | 설명 | 예시 |
|------|------|------|
| `primary` | 주요 액션 색상 | `#256EF4` |
| `text-main` | 본문 텍스트 | `#1E2124` |
| `text-sub` | 보조 텍스트 | `#464C53` |
| `bg-base` | 기본 배경 | `#FFFFFF` |
| `bg-alt` | 대안 배경 | `#F4F5F6` |

#### 2. 타이포그래피 (Typography) - 3개

| 토큰 | 크기 | 설명 |
|------|------|------|
| `title` | 20px+ | 제목용 |
| `body` | 14~16px | 본문용 |
| `caption` | 12px | 캡션/보조 텍스트 |

#### 3. 간격 (Spacing) - 3개

| 토큰 | 값 | 설명 |
|------|-----|------|
| `sm` | 8px | 작은 간격 |
| `md` | 16px | 기본 간격 |
| `lg` | 24px | 큰 간격 |

### 마크다운 본문 필수 섹션 (6개)

| 섹션 | 포함 내용 |
|------|-----------|
| **1. 브랜드 톤과 분위기** | 제품이 전달해야 할 감정, 성격 |
| **2. 색상 체계** | 브랜드 컬러, 배경색, 상태색 + 맥락 |
| **3. 타이포그래피** | 제목/본문 성격, 폰트 규칙 |
| **4. 레이아웃과 간격** | 그리드, 섹션 간격, 콘텐츠 최대 폭 |
| **5. 컴포넌트 규칙** | 버튼, 입력창, 카드 등 반복 요소 |
| **6. 금지 규칙** | AI가 피해야 할 표현 |

---

## 선택 항목

### YAML 프론트매터 선택 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `version` | string | 현재: `"alpha"` |
| `description` | string | 디자인 시스템 설명 |
| `omitted` | string[] | 생략된 섹션 명시 |

### 확장 토큰 (선택)

#### 1. 추가 색상

| 토큰 | 설명 |
|------|------|
| `secondary` | 보조 색상 |
| `accent` | 강조 색상 |
| `danger` | 위험/에러 |
| `warning` | 경고 |
| `success` | 성공 |
| `info` | 정보 |

#### 2. 확장 타이포그래피

| 토큰 | 설명 |
|------|------|
| `display` | 배너/마케팅용 대형 텍스트 |
| `heading-lg/md/sm` | 단계별 제목 |
| `label` | 버튼/입력 라벨 |

#### 3. 추가 간격

| 토큰 | 값 |
|------|-----|
| `xs` | 4px |
| `xl` | 32px |
| `xxl` | 40px |

#### 4. 래디어스 (rounded)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `sm` | 4px | 작은 요소 |
| `md` | 8px | 일반 요소 |
| `lg` | 12px | 카드, 모달 |
| `full` | 9999px | 원형 |

#### 5. 엘리베이션 (elevation)

| 토큰 | 설명 |
|------|------|
| `shadow-sm` | 미세한 그림자 |
| `shadow-md` | 카드/드롭다운 |
| `shadow-lg` | 모달/팝업 |

#### 6. 컴포넌트

| 컴포넌트 | 정의 항목 |
|----------|-----------|
| `button-primary` | backgroundColor, textColor, rounded, padding |
| `button-secondary` | backgroundColor, textColor, border |
| `input` | backgroundColor, borderColor, rounded, height |
| `card` | backgroundColor, rounded, shadow, padding |

---

## 마크다운 본문 섹션

### 필수 섹션 순서 (8개)

| 순서 | 섹션 | 내용 |
|------|------|------|
| 1 | **Overview** | 브랜드 성격, 타겟, 무드, 디자인 철학 |
| 2 | **Colors** | 팔레트 및 역할, Primary 필수 |
| 3 | **Typography** | 폰트, 위계, 사용 규칙 |
| 4 | **Layout** | 패딩, 그리드, 간격, 브레이크포인트 |
| 5 | **Elevation & Depth** | 섀도우, 레이어 시스템 |
| 6 | **Shapes** | 모서리/형태 규칙 |
| 7 | **Components** | 상태별 지침 (hover, active, disabled) |
| 8 | **Do's and Don'ts** | 실전 가이드, 금지 사항 |

### 선택 섹션

| 섹션 | 내용 |
|------|------|
| **Icons** | 아이콘 스타일, 크기, 색상 규칙 |
| **Motion** | 애니메이션, 트랜지션 규칙 |
| **Accessibility** | 접근성 기준 |
| **Responsive** | 브레이크포인트, 터치 타깃, 축소 전략 |

---

## Do's and Don'ts

### Do's (권장)

```markdown
- 역할 기반 토큰명 사용 (`color-action-primary` > `blue-500`)
- 구체적으로 작성 ("세련되게" X → "여백 24px, 그림자 없음" O)
- 반복 요소부터 정의 (색상→타이포→버튼→입력→카드)
- 금지 규칙 반드시 포함
- 제품 성격 명시 (생산성/금융/커뮤니티/개발자)
```

### Don'ts (금지)

```markdown
- 과한 그라디언트
- 3D 장식 효과
- 과도한 애니메이션
- 장식용 그림자
- 불필요한 아이콘 남용
- 저대비 텍스트
```

---

## 실전 템플릿

### 최소 버전 (MVP)

```yaml
---
name: "My App Design"
colors:
  primary: "#256EF4"
  text-main: "#1E2124"
  text-sub: "#464C53"
  bg-base: "#FFFFFF"
  bg-alt: "#F4F5F6"
typography:
  title:
    fontFamily: "Pretendard"
    fontSize: "24px"
    fontWeight: 700
  body:
    fontFamily: "Pretendard"
    fontSize: "16px"
    fontWeight: 400
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
---

## Overview
[제품 성격, 타겟 사용자, 전달하고자 하는 감정]

## Colors
- Primary: 주요 CTA, 활성 상태
- Text: 본문과 보조 텍스트 구분
- Background: 기본 배경과 카드/섹션 배경

## Typography
- Title: 제목용, 강하고 선명하게
- Body: 본문용, 가독성 우선

## Layout
- 기본 간격: 16px
- 섹션 간격: 24px
- 최대 콘텐츠 폭: 1200px

## Components
- 버튼: Primary 색상 배경, 흰색 텍스트, 6px radius
- 입력: 1px 테두리, 8px radius, 48px 높이

## Do's and Don'ts
### Do
- 여백 충분히 사용
- 명확한 시각 위계

### Don't
- 과도한 그라디언트
- 장식용 애니메이션
```

### 전체 버전

```yaml
---
version: "alpha"
name: "Full Design System"
description: "완전한 디자인 시스템 예시"

colors:
  # Primary
  primary: "#256EF4"
  primary-hover: "#0B50D0"
  primary-light: "#ECF2FE"

  # Text
  text-main: "#1E2124"
  text-sub: "#464C53"
  text-muted: "#8C939A"

  # Background
  bg-base: "#FFFFFF"
  bg-alt: "#F4F5F6"
  bg-elevated: "#FFFFFF"

  # System
  danger: "#DE3412"
  warning: "#FFB114"
  success: "#228738"
  info: "#0B78CB"

  # Border
  border-strong: "#58616A"
  border-subtle: "#B1B8BE"

typography:
  display:
    fontFamily: "Pretendard"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.2
  heading-lg:
    fontFamily: "Pretendard"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.5
  heading-md:
    fontFamily: "Pretendard"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Pretendard"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "40px"

rounded:
  sm: "4px"
  md: "6px"
  lg: "12px"
  full: "9999px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    border: "1px solid {colors.primary}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.md}"
    height: "56px"
  card:
    backgroundColor: "{colors.bg-elevated}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

## Overview
[전체 디자인 철학, 브랜드 성격, 타겟 사용자 설명]

## Colors
[색상 사용 가이드, 상태별 색상 적용 규칙]

## Typography
[폰트 사용 규칙, 위계 구조, 가독성 원칙]

## Layout
[그리드 시스템, 브레이크포인트, 간격 사용 규칙]

## Elevation & Depth
[그림자 시스템, z-index 규칙]

## Shapes
[모서리 둥글기 사용 규칙]

## Components
[버튼, 입력, 카드 등 컴포넌트별 상태 가이드]

## Do's and Don'ts
[권장 사항과 금지 사항]
```

---

## 참고 자료

- [Google Labs DESIGN.md Spec](https://github.com/google-labs-code/design.md)
- [DESIGN.md 공식 스펙](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- [ko/design.md 카탈로그](https://www.getdesign.kr)
- [DESIGN.md 완전 가이드](https://acdigest.substack.com/p/designmd-the-complete-guide)
- [Design.md 뽀개기](https://brunch.co.kr/@figmaster/64)
- [DESIGN.md란 무엇인가](https://uxdev.org/blog/360-design-md-ai/)

---

*이 문서는 Google Labs DESIGN.md 스펙 및 ko/design.md를 기반으로 정리되었습니다.*
