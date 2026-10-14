---
version: "1.0"
name: "AIchatCollector Design System"
description: "단순 · 유연 · 부드러움 · 세련 · 직관 - Apple HIG 참고"

colors:
  # Primary
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-active: "#1E40AF"
  primary-light: "#EFF6FF"
  primary-muted: "#BFDBFE"

  # Text
  text-primary: "#111827"
  text-secondary: "#4B5563"
  text-tertiary: "#9CA3AF"
  text-disabled: "#D1D5DB"
  text-inverse: "#FFFFFF"

  # Background
  bg-base: "#FFFFFF"
  bg-subtle: "#F9FAFB"
  bg-muted: "#F3F4F6"
  bg-elevated: "#FFFFFF"
  bg-overlay: "rgba(0,0,0,0.4)"

  # Border
  border-default: "#E5E7EB"
  border-strong: "#D1D5DB"
  border-focus: "#2563EB"

  # System
  success: "#10B981"
  success-light: "#D1FAE5"
  warning: "#F59E0B"
  warning-light: "#FEF3C7"
  danger: "#EF4444"
  danger-light: "#FEE2E2"
  info: "#3B82F6"
  info-light: "#DBEAFE"

typography:
  font-family: '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif'

  display:
    fontSize: "48px"
    fontSizeMobile: "32px"
    fontWeight: 700
    lineHeight: 1.2

  title-lg:
    fontSize: "32px"
    fontSizeMobile: "24px"
    fontWeight: 700
    lineHeight: 1.3

  title-md:
    fontSize: "24px"
    fontSizeMobile: "20px"
    fontWeight: 600
    lineHeight: 1.4

  title-sm:
    fontSize: "19px"
    fontSizeMobile: "17px"
    fontWeight: 600
    lineHeight: 1.4

  body-lg:
    fontSize: "17px"
    fontSizeMobile: "16px"
    fontWeight: 400
    lineHeight: 1.6

  body:
    fontSize: "16px"
    fontSizeMobile: "15px"
    fontWeight: 400
    lineHeight: 1.6

  body-sm:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5

  caption:
    fontSize: "13px"
    fontSizeMobile: "12px"
    fontWeight: 400
    lineHeight: 1.5

  label:
    fontSize: "14px"
    fontSizeMobile: "13px"
    fontWeight: 500
    lineHeight: 1.4

spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "20px"
  space-6: "24px"
  space-8: "32px"
  space-10: "40px"
  space-12: "48px"

rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "9999px"

elevation:
  shadow-sm: "0 1px 2px rgba(0,0,0,0.04)"
  shadow-md: "0 4px 12px rgba(0,0,0,0.08)"
  shadow-lg: "0 8px 24px rgba(0,0,0,0.12)"
  shadow-xl: "0 16px 48px rgba(0,0,0,0.16)"

motion:
  duration-fast: "150ms"
  duration-normal: "250ms"
  duration-slow: "400ms"
  ease-default: "cubic-bezier(0.4, 0, 0.2, 1)"
  ease-out: "cubic-bezier(0, 0, 0.2, 1)"
  ease-in: "cubic-bezier(0.4, 0, 1, 1)"

breakpoints:
  sm: "480px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    backgroundColorHover: "{colors.primary-hover}"
    backgroundColorActive: "{colors.primary-active}"
    textColor: "{colors.text-inverse}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.space-3} {spacing.space-6}"
    fontSize: "15px"
    fontWeight: 500
    transition: "all {motion.duration-fast} {motion.ease-default}"
    hoverTransform: "translateY(-1px)"
    hoverShadow: "{elevation.shadow-md}"

  button-secondary:
    backgroundColor: "{colors.primary-light}"
    backgroundColorHover: "{colors.primary-muted}"
    textColor: "{colors.primary}"
    border: "1px solid {colors.primary-muted}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.space-3} {spacing.space-6}"

  button-tertiary:
    backgroundColor: "transparent"
    backgroundColorHover: "{colors.bg-muted}"
    textColor: "{colors.text-secondary}"
    border: "1px solid {colors.border-default}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.space-3} {spacing.space-6}"

  input:
    backgroundColor: "{colors.bg-base}"
    borderColor: "{colors.border-default}"
    borderColorFocus: "{colors.border-focus}"
    borderColorError: "{colors.danger}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.space-3} {spacing.space-4}"
    fontSize: "15px"
    focusRing: "0 0 0 3px {colors.primary-light}"

  card:
    backgroundColor: "{colors.bg-elevated}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.space-6}"
    border: "1px solid {colors.border-default}"
    hoverTransform: "translateY(-2px)"
    hoverShadow: "{elevation.shadow-md}"
    transition: "transform {motion.duration-normal} {motion.ease-out}, box-shadow {motion.duration-normal} {motion.ease-default}"

  chip:
    backgroundColor: "{colors.bg-muted}"
    backgroundColorActive: "{colors.primary-light}"
    textColor: "{colors.text-secondary}"
    textColorActive: "{colors.primary}"
    borderRadius: "{rounded.full}"
    padding: "{spacing.space-1} {spacing.space-3}"
    fontSize: "13px"

  modal:
    backgroundColor: "{colors.bg-elevated}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.space-8}"
    shadow: "{elevation.shadow-xl}"
    overlayColor: "{colors.bg-overlay}"
---

## Overview

AIchatCollector는 **단순하고 직관적인** AI 대화 수집 도구입니다.

### 디자인 원칙

1. **단순함** - 불필요한 요소 제거, 핵심 기능에 집중
2. **직관성** - 설명 없이도 이해되는 UI
3. **부드러움** - 둥근 모서리, 여유로운 여백, 부드러운 전환
4. **세련됨** - 절제된 색상, 정교한 타이포그래피
5. **유연함** - 반응형 레이아웃, 다양한 콘텐츠 대응

### 참고 스타일

Apple Human Interface Guidelines를 참고합니다:
- 큰 래디어스 (10-20px)
- 넉넉한 여백
- 미세하고 부드러운 그림자
- 절제된 색상 사용

---

## Colors

### Primary (차분한 블루)

주요 액션과 강조에 사용합니다. 신뢰감을 주는 차분한 블루 계열입니다.

- `primary` - 버튼, 링크, 활성 상태
- `primary-hover` - 호버 상태
- `primary-light` - 약한 배경, 선택 상태, 포커스 링

### Text

명확한 위계를 위해 3단계로 구분합니다:

- `text-primary` - 제목, 주요 텍스트 (가장 진함)
- `text-secondary` - 본문 (기본)
- `text-tertiary` - 보조 정보, 캡션 (가장 연함)

### Background

레이어를 구분하되 미세한 차이로:

- `bg-base` - 페이지 배경 (순백)
- `bg-subtle` - 카드, 섹션 배경 (거의 흰색)
- `bg-muted` - 입력 필드, 칩 배경 (약간 회색)

### System

상태를 명확히 전달:

- `success` - 성공, 완료
- `warning` - 주의, 경고
- `danger` - 에러, 삭제
- `info` - 정보, 안내

---

## Typography

### 서체

Pretendard를 기본으로 사용합니다. 시스템 폰트 폴백을 포함합니다.

### 크기 위계

제목과 본문 사이에 명확한 차이를 둡니다:

| 용도 | Desktop | Mobile | 두께 |
|------|---------|--------|------|
| display | 48px | 32px | 700 |
| title-lg | 32px | 24px | 700 |
| title-md | 24px | 20px | 600 |
| body | 16px | 15px | 400 |
| caption | 13px | 12px | 400 |

### 줄 간격

- 제목: 1.2 ~ 1.4 (촘촘하게)
- 본문: 1.6 (여유롭게, 가독성)

### 두께

주로 400(본문)과 600-700(제목)을 사용합니다. 과도한 두께 변화를 피합니다.

---

## Layout

### 간격

8px 기반 스케일을 사용합니다:

- `space-2` (8px) - 아이콘과 텍스트 사이
- `space-4` (16px) - 기본 패딩
- `space-6` (24px) - 카드 내부 패딩
- `space-8` (32px) - 섹션 간격

### 여백 철학

**넉넉하게**. 콘텐츠가 숨 쉴 수 있는 공간을 줍니다.
밀도보다 가독성을 우선합니다.

### 반응형

Mobile-first 접근:

- `< 480px` - 모바일 (기본)
- `480px+` - 큰 모바일
- `768px+` - 태블릿
- `1024px+` - 데스크톱

---

## Elevation & Depth

### 그림자

부드럽고 미세하게. blur 값을 크게 해서 자연스럽게:

- `shadow-sm` - 미세한 구분 (거의 안 보임)
- `shadow-md` - 카드 호버, 드롭다운
- `shadow-lg` - 팝오버
- `shadow-xl` - 모달

### Lift 효과

호버 시 살짝 떠오르는 효과:

```css
transform: translateY(-2px);
box-shadow: var(--shadow-md);
```

---

## Shapes

### 모서리 (Rounded)

Apple 스타일의 큰 래디어스:

- `sm` (6px) - 칩, 작은 요소
- `md` (10px) - 버튼, 입력
- `lg` (14px) - 카드
- `xl` (20px) - 모달
- `full` - 원형 (태그, 아바타)

### 원칙

- 각진 모서리 금지
- 비슷한 크기 요소는 같은 래디어스

---

## Components

### Button

3가지 변형:

1. **Primary** - 주요 액션 (페이지당 1-2개)
2. **Secondary** - 보조 액션
3. **Tertiary** - 약한 액션, 취소

호버 시 살짝 위로 떠오르고 그림자가 생깁니다.

### Input

- 1px 테두리, 10px 래디어스
- 포커스 시 파란 테두리 + 3px 링
- 에러 시 빨간 테두리

### Card

- 14px 래디어스
- 1px 미세한 테두리
- 호버 시 lift 효과 (translateY + shadow)

### Chip

- 완전한 둥근 모서리 (pill shape)
- 활성 시 primary-light 배경

---

## Motion

### 원칙

부드럽고 자연스럽게. 과하지 않게.

### 속도

- `fast` (150ms) - 즉각 반응 (호버, 색상 변화)
- `normal` (250ms) - 기본 전환 (카드 호버)
- `slow` (400ms) - 큰 변화 (모달, 페이지)

### 이징

- `ease-out` - 등장 (빠르게 나타나고 천천히 정착)
- `ease-in` - 퇴장 (천천히 시작하고 빠르게 사라짐)
- `ease-default` - 기본 (부드러운 시작과 끝)

### 적용 예시

```css
/* 버튼 호버 */
transition: all 150ms ease;

/* 카드 호버 */
transition: transform 250ms ease-out, box-shadow 250ms ease;

/* 모달 등장 */
transition: opacity 400ms ease-out, transform 400ms ease-out;
```

---

## Do's and Don'ts

### Do's ✅

- 여백을 넉넉하게
- 둥근 모서리 사용
- 부드러운 전환 애니메이션
- 명확한 시각적 위계
- 차분한 색상 사용
- 호버 시 미세한 피드백

### Don'ts ❌

- 화려한 그라디언트
- 현란하거나 과도한 애니메이션
- 각진 모서리
- 날카로운/강한 그림자
- 빽빽한 텍스트
- 강렬한 색상 남발
- 뚝뚝 끊기는 상태 변화 (애니메이션 없이)
- 복잡한 장식 요소

---

## Responsive Behavior

### 브레이크포인트

| 이름 | 값 | 대상 |
|------|-----|------|
| sm | 480px | 큰 모바일 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 대형 화면 |

### 변화 전략

- **타이포**: 모바일에서 약간 작게
- **여백**: 모바일에서 줄임 (24px → 16px)
- **레이아웃**: 그리드 → 단일 컬럼
- **터치 영역**: 모바일에서 최소 44px

---

## Dark Mode

시스템 설정을 따릅니다 (`prefers-color-scheme: dark`).

### 변경되는 값

| 토큰 | Light | Dark |
|------|-------|------|
| text-primary | #111827 | #F9FAFB |
| text-secondary | #4B5563 | #D1D5DB |
| bg-base | #FFFFFF | #111827 |
| bg-subtle | #F9FAFB | #1F2937 |
| border-default | #E5E7EB | #374151 |

### 유지되는 값

- Primary 색상 (약간 밝게 조정 가능)
- System 색상
- 그림자 (opacity 조정)

---

## Agent Prompt Guide

### 빠른 참조

```
Primary: #2563EB
Text: #111827 → #4B5563 → #9CA3AF
Background: #FFFFFF → #F9FAFB → #F3F4F6
Rounded: 6px / 10px / 14px / 20px
Shadow: rgba(0,0,0, 0.04~0.16), blur 2~48px
Motion: 150ms / 250ms / 400ms, ease-out
```

### 스타일 키워드

```
단순, 직관, 부드러움, 세련, 여유, Apple 스타일
큰 래디어스, 넉넉한 여백, 미세한 그림자, 부드러운 전환
```
