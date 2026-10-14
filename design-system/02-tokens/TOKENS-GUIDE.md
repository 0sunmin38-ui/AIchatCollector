# 디자인 토큰 가이드

> **참고**: [Google Labs DESIGN.md Spec](https://github.com/google-labs-code/design.md)
> **토큰 표준**: [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)

---

## 목차

1. [디자인 토큰이란?](#디자인-토큰이란)
2. [토큰 카테고리](#토큰-카테고리)
3. [필수 토큰](#필수-토큰)
4. [선택 토큰](#선택-토큰)
5. [토큰 네이밍 규칙](#토큰-네이밍-규칙)
6. [토큰 참조 문법](#토큰-참조-문법)
7. [실전 토큰 스키마](#실전-토큰-스키마)

---

## 디자인 토큰이란?

디자인 토큰은 **디자인 결정을 저장하는 플랫폼에 독립적인 변수**입니다.

```
색상 값 → 토큰화 → 코드에서 재사용
#256EF4 → primary → button.backgroundColor = {colors.primary}
```

### 토큰 vs 하드코딩

| 하드코딩 | 토큰 |
|----------|------|
| `background: #256EF4;` | `background: var(--color-primary);` |
| 변경 시 모든 곳 수정 | 토큰만 수정하면 전체 반영 |
| 의미 불명확 | 역할이 명확 |

---

## 토큰 카테고리

DESIGN.md에서 정의하는 **5개 필수 토큰 카테고리**:

| 카테고리 | 키 | 설명 |
|----------|-----|------|
| **Colors** | `colors` | 색상 팔레트 |
| **Typography** | `typography` | 서체, 크기, 행간 |
| **Spacing** | `spacing` | 여백, 간격 |
| **Rounded** | `rounded` | 모서리 둥글기 |
| **Components** | `components` | 컴포넌트별 토큰 조합 |

---

## 필수 토큰

디자인 시스템 구축 시 **반드시 정의해야 할 토큰**입니다.

### 1. Colors (색상) - 필수 5개

```yaml
colors:
  # === 필수 ===
  primary: "#256EF4"        # 주요 액션 색상
  text-main: "#1E2124"      # 본문 텍스트
  text-sub: "#464C53"       # 보조 텍스트
  bg-base: "#FFFFFF"        # 기본 배경
  bg-alt: "#F4F5F6"         # 대안 배경 (카드, 섹션)
```

| 토큰 | 역할 | 사용처 |
|------|------|--------|
| `primary` | 브랜드 주요 색상 | 버튼, 링크, 포커스 링 |
| `text-main` | 본문 텍스트 | 일반 본문 |
| `text-sub` | 보조 텍스트 | 설명, 캡션 |
| `bg-base` | 기본 배경 | 페이지 배경 |
| `bg-alt` | 대안 배경 | 카드, 섹션 배경 |

### 2. Typography (타이포그래피) - 필수 3개

```yaml
typography:
  # === 필수 ===
  title:
    fontFamily: "Pretendard"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.5

  body:
    fontFamily: "Pretendard"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5

  caption:
    fontFamily: "Pretendard"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
```

| 토큰 | 크기 기준 | 용도 |
|------|-----------|------|
| `title` | 20px+ | 제목, 헤딩 |
| `body` | 14~17px | 본문 텍스트 |
| `caption` | 12~13px | 캡션, 보조 설명 |

**Typography 속성:**

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `fontFamily` | string | O | 폰트 패밀리 |
| `fontSize` | Dimension | O | 폰트 크기 |
| `fontWeight` | number | O | 폰트 두께 |
| `lineHeight` | number/Dimension | O | 행간 |
| `letterSpacing` | Dimension | X | 자간 |

### 3. Spacing (간격) - 필수 3개

```yaml
spacing:
  # === 필수 ===
  sm: "8px"     # 작은 간격
  md: "16px"    # 기본 간격
  lg: "24px"    # 큰 간격
```

| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `sm` | 8px | 아이콘-텍스트, 작은 요소 간격 |
| `md` | 16px | 기본 패딩, 요소 간격 |
| `lg` | 24px | 섹션 간격, 카드 패딩 |

---

## 선택 토큰

프로젝트 규모와 요구사항에 따라 **추가할 수 있는 토큰**입니다.

### 1. 확장 Colors

```yaml
colors:
  # === 기존 필수 ===
  primary: "#256EF4"
  # ...

  # === 선택: Primary 변형 ===
  primary-hover: "#0B50D0"
  primary-light: "#ECF2FE"
  primary-dark: "#083891"

  # === 선택: Secondary ===
  secondary: "#346FB2"
  secondary-light: "#E8F0F8"

  # === 선택: Accent ===
  accent: "#D63D4A"

  # === 선택: System 상태 ===
  danger: "#DE3412"
  danger-light: "#FEECEC"
  warning: "#FFB114"
  warning-light: "#FFF8E6"
  success: "#228738"
  success-light: "#E8F5EC"
  info: "#0B78CB"
  info-light: "#E6F3FA"

  # === 선택: Text 확장 ===
  text-muted: "#8C939A"
  text-disabled: "#B1B8BE"
  text-inverse: "#FFFFFF"

  # === 선택: Border ===
  border-strong: "#58616A"
  border-subtle: "#B1B8BE"
  border-focus: "#256EF4"

  # === 선택: Surface ===
  surface-elevated: "#FFFFFF"
  surface-overlay: "rgba(0, 0, 0, 0.5)"
```

### 2. 확장 Typography

```yaml
typography:
  # === 기존 필수 ===
  title:
    # ...
  body:
    # ...
  caption:
    # ...

  # === 선택: Display (배너/마케팅) ===
  display-lg:
    fontFamily: "Pretendard"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1px"

  display-md:
    fontFamily: "Pretendard"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.2

  # === 선택: Heading 세분화 ===
  heading-xl:
    fontFamily: "Pretendard"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.5

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

  heading-sm:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.5

  # === 선택: Body 변형 ===
  body-lg:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5

  body-bold:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.5

  body-sm:
    fontFamily: "Pretendard"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5

  # === 선택: Label (UI 요소) ===
  label-lg:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5

  label-md:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5

  label-sm:
    fontFamily: "Pretendard"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
```

### 3. 확장 Spacing

```yaml
spacing:
  # === 기존 필수 ===
  sm: "8px"
  md: "16px"
  lg: "24px"

  # === 선택: 8-point 그리드 확장 ===
  xs: "4px"      # 아이콘 내부, 최소 간격
  xl: "32px"     # 큰 섹션 간격
  xxl: "40px"    # 모달 패딩
  xxxl: "48px"   # 페이지 상단 여백

  # === 선택: 특수 용도 ===
  page-margin: "24px"
  card-padding: "24px"
  input-padding: "16px"
  button-padding-x: "24px"
  button-padding-y: "12px"
```

### 4. Rounded (모서리 둥글기) - 전체 선택

```yaml
rounded:
  # === 권장 ===
  none: "0px"
  xs: "2px"      # 작은 요소 (8x8 ~ 16x16)
  sm: "4px"      # 배지, 작은 버튼
  md: "6px"      # 기본 버튼, 입력
  lg: "8px"      # 카드, 입력 필드
  xl: "12px"     # 모달, 대형 카드
  full: "9999px" # 원형 (아바타, 태그)
```

**계산 공식**: `컨테이너 높이 × 1/8 = 래디어스값`

### 5. Elevation (그림자) - 전체 선택

```yaml
elevation:
  # === 권장 ===
  shadow-none: "none"
  shadow-sm: "0 1px 2px rgba(0, 0, 0, 0.05)"
  shadow-md: "0 4px 6px rgba(0, 0, 0, 0.1)"
  shadow-lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
  shadow-xl: "0 20px 25px rgba(0, 0, 0, 0.15)"
```

| 토큰 | 사용처 |
|------|--------|
| `shadow-sm` | 미세한 구분 |
| `shadow-md` | 카드, 드롭다운 |
| `shadow-lg` | 모달, 팝업 |
| `shadow-xl` | 오버레이 |

### 6. Components - 전체 선택

```yaml
components:
  # === 버튼 ===
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 {spacing.lg}"
    typography: "{typography.label-md}"

  button-secondary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    border: "1px solid {colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"

  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.text-main}"
    border: "1px solid {colors.border-strong}"
    rounded: "{rounded.md}"
    height: "48px"

  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    height: "48px"

  # === 입력 필드 ===
  input:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    borderColorFocus: "{colors.primary}"
    borderColorError: "{colors.danger}"
    rounded: "{rounded.lg}"
    height: "56px"
    padding: "0 {spacing.md}"
    typography: "{typography.body}"

  # === 카드 ===
  card:
    backgroundColor: "{colors.bg-base}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    shadow: "{elevation.shadow-md}"

  # === 모달 ===
  modal:
    backgroundColor: "{colors.bg-base}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    shadow: "{elevation.shadow-xl}"
    overlayColor: "{colors.surface-overlay}"
```

### 7. Motion (모션) - 전체 선택

```yaml
motion:
  # === 지속 시간 ===
  duration-fast: "150ms"
  duration-normal: "300ms"
  duration-slow: "500ms"

  # === 이징 ===
  ease-default: "ease-in-out"
  ease-in: "ease-in"
  ease-out: "ease-out"

  # === 조합 ===
  transition-base: "400ms ease-in-out"
  transition-fade: "400ms linear"
  transition-collapse: "400ms ease"
```

### 8. Breakpoints (브레이크포인트) - 전체 선택

```yaml
breakpoints:
  sm: "360px"    # 모바일
  md: "768px"    # 태블릿
  lg: "1024px"   # 데스크톱
  xl: "1280px"   # 대형 화면
```

---

## 토큰 네이밍 규칙

### 좋은 네이밍 vs 나쁜 네이밍

| 나쁨 | 좋음 | 이유 |
|------|------|------|
| `blue-500` | `color-primary` | 역할 명시 |
| `text-12` | `caption` | 의미 전달 |
| `margin-16` | `spacing-md` | 스케일 표현 |
| `radius-8` | `rounded-lg` | 상대적 크기 |

### 네이밍 패턴

```
[카테고리]-[역할]-[변형]

예시:
color-primary
color-primary-hover
color-text-main
color-text-sub
typography-heading-lg
spacing-md
rounded-lg
```

### 계층 구조

```yaml
colors:
  # 1단계: 기본
  primary: "#256EF4"

  # 2단계: 변형
  primary-hover: "#0B50D0"
  primary-light: "#ECF2FE"
  primary-dark: "#083891"
```

---

## 토큰 참조 문법

### 기본 참조

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"  # 토큰 참조
    textColor: "#FFFFFF"                 # 직접 값
```

### 중첩 참조

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "0 {spacing.lg}"
```

### 참조 규칙

| 형식 | 설명 |
|------|------|
| `{path.to.token}` | 중괄호로 감싸기 |
| `{colors.primary}` | 카테고리.토큰명 |
| `"{spacing.md}"` | 문자열 내 참조 |

---

## 실전 토큰 스키마

### 최소 버전 (MVP)

```yaml
---
name: "My App"

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
    lineHeight: 1.5
  body:
    fontFamily: "Pretendard"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Pretendard"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5

spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
---
```

### 표준 버전

```yaml
---
version: "alpha"
name: "Standard Design System"

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

  # System
  danger: "#DE3412"
  warning: "#FFB114"
  success: "#228738"
  info: "#0B78CB"

  # Border
  border-strong: "#58616A"
  border-subtle: "#B1B8BE"

typography:
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
  body-sm:
    fontFamily: "Pretendard"
    fontSize: "15px"
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

rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    height: "48px"
  input:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.lg}"
    height: "56px"
---
```

### 전체 버전 (Enterprise)

```yaml
---
version: "alpha"
name: "Enterprise Design System"
description: "완전한 엔터프라이즈 디자인 시스템"

colors:
  # === Primary ===
  primary: "#256EF4"
  primary-hover: "#0B50D0"
  primary-pressed: "#083891"
  primary-light: "#ECF2FE"
  primary-dark: "#083891"

  # === Secondary ===
  secondary: "#346FB2"
  secondary-hover: "#2A5A91"
  secondary-light: "#E8F0F8"

  # === Accent ===
  accent: "#D63D4A"

  # === Text ===
  text-main: "#1E2124"
  text-sub: "#464C53"
  text-muted: "#8C939A"
  text-disabled: "#B1B8BE"
  text-inverse: "#FFFFFF"

  # === Background ===
  bg-base: "#FFFFFF"
  bg-alt: "#F4F5F6"
  bg-elevated: "#FFFFFF"
  bg-overlay: "rgba(0, 0, 0, 0.5)"

  # === System ===
  danger: "#DE3412"
  danger-hover: "#AB2B36"
  danger-light: "#FEECEC"
  warning: "#FFB114"
  warning-text: "#9E6A00"
  warning-light: "#FFF8E6"
  success: "#228738"
  success-hover: "#1A6B2C"
  success-light: "#E8F5EC"
  info: "#0B78CB"
  info-hover: "#0960A3"
  info-light: "#E6F3FA"

  # === Border ===
  border-strong: "#58616A"
  border-subtle: "#B1B8BE"
  border-focus: "#256EF4"
  border-error: "#DE3412"

typography:
  # === Display ===
  display-lg:
    fontFamily: "Pretendard"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1px"
  display-md:
    fontFamily: "Pretendard"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1px"

  # === Heading ===
  heading-xl:
    fontFamily: "Pretendard"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.5
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
  heading-sm:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.5
  heading-xs:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.5

  # === Body ===
  body-lg:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  body-bold:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.5
  body-sm:
    fontFamily: "Pretendard"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Pretendard"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5

  # === Label ===
  label-lg:
    fontFamily: "Pretendard"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label-sm:
    fontFamily: "Pretendard"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "40px"
  xxxl: "48px"

rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"

elevation:
  shadow-none: "none"
  shadow-sm: "0 1px 2px rgba(0, 0, 0, 0.05)"
  shadow-md: "0 4px 6px rgba(0, 0, 0, 0.1)"
  shadow-lg: "0 10px 15px rgba(0, 0, 0, 0.1)"
  shadow-xl: "0 20px 25px rgba(0, 0, 0, 0.15)"

motion:
  duration-fast: "150ms"
  duration-normal: "300ms"
  duration-slow: "500ms"
  ease-default: "ease-in-out"
  transition-base: "400ms ease-in-out"

breakpoints:
  sm: "360px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"

components:
  # === Buttons ===
  button-primary:
    backgroundColor: "{colors.primary}"
    backgroundColorHover: "{colors.primary-hover}"
    backgroundColorPressed: "{colors.primary-pressed}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
    typography: "{typography.label-md}"

  button-secondary:
    backgroundColor: "{colors.primary-light}"
    backgroundColorHover: "#D9E6FD"
    textColor: "{colors.primary}"
    border: "1px solid {colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"

  button-tertiary:
    backgroundColor: "transparent"
    backgroundColorHover: "{colors.bg-alt}"
    textColor: "{colors.text-main}"
    border: "1px solid {colors.border-strong}"
    rounded: "{rounded.md}"
    height: "48px"

  button-danger:
    backgroundColor: "{colors.danger}"
    backgroundColorHover: "{colors.danger-hover}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    height: "48px"

  button-ghost:
    backgroundColor: "transparent"
    backgroundColorHover: "{colors.bg-alt}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"

  # === Inputs ===
  input:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    borderColorFocus: "{colors.border-focus}"
    borderColorError: "{colors.border-error}"
    rounded: "{rounded.lg}"
    height: "56px"
    padding: "0 16px"
    typography: "{typography.body}"
    focusRing: "0 0 0 4px {colors.primary-light}"

  select:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.md}"
    height: "56px"

  textarea:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.lg}"
    padding: "16px"
    minHeight: "120px"

  # === Cards ===
  card:
    backgroundColor: "{colors.bg-base}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    shadow: "{elevation.shadow-md}"

  card-elevated:
    backgroundColor: "{colors.bg-elevated}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    shadow: "{elevation.shadow-lg}"

  # === Modal ===
  modal:
    backgroundColor: "{colors.bg-base}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    shadow: "{elevation.shadow-xl}"
    overlayColor: "{colors.bg-overlay}"

  # === Badge ===
  badge:
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.caption}"

  badge-danger:
    backgroundColor: "{colors.danger-light}"
    textColor: "{colors.danger}"

  badge-success:
    backgroundColor: "{colors.success-light}"
    textColor: "{colors.success}"

  badge-warning:
    backgroundColor: "{colors.warning-light}"
    textColor: "{colors.warning-text}"

  badge-info:
    backgroundColor: "{colors.info-light}"
    textColor: "{colors.info}"
---
```

---

## 체크리스트

### 필수 토큰 체크리스트

- [ ] `colors.primary` - 주요 색상
- [ ] `colors.text-main` - 본문 텍스트
- [ ] `colors.text-sub` - 보조 텍스트
- [ ] `colors.bg-base` - 기본 배경
- [ ] `colors.bg-alt` - 대안 배경
- [ ] `typography.title` - 제목
- [ ] `typography.body` - 본문
- [ ] `typography.caption` - 캡션
- [ ] `spacing.sm` - 작은 간격
- [ ] `spacing.md` - 기본 간격
- [ ] `spacing.lg` - 큰 간격

### 권장 토큰 체크리스트

- [ ] `colors.primary-hover` - 호버 상태
- [ ] `colors.danger` - 에러/위험
- [ ] `colors.success` - 성공
- [ ] `colors.border-*` - 테두리
- [ ] `typography.heading-*` - 제목 단계
- [ ] `rounded.*` - 모서리 둥글기
- [ ] `elevation.shadow-*` - 그림자
- [ ] `components.button-*` - 버튼
- [ ] `components.input` - 입력 필드

---

## 참고 자료

- [Google Labs DESIGN.md](https://github.com/google-labs-code/design.md)
- [DESIGN.md Spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- [W3C Design Tokens](https://www.w3.org/community/design-tokens/)
- [ko/design.md](https://www.getdesign.kr)
- [DESIGN.md Complete Guide](https://acdigest.substack.com/p/designmd-the-complete-guide)

---

*이 문서는 Google Labs DESIGN.md 스펙을 기반으로 정리되었습니다.*
