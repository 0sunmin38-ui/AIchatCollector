# 디자인 토큰

> 컨셉: 단순 · 유연 · 부드러움 · 세련 · 직관 (Apple HIG 참고)

---

## Colors

### Primary (차분한 블루)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `primary` | `#2563EB` | 주요 액션, 링크 |
| `primary-hover` | `#1D4ED8` | 호버 상태 |
| `primary-active` | `#1E40AF` | 클릭/활성 |
| `primary-light` | `#EFF6FF` | 약한 배경, 선택 상태 |
| `primary-muted` | `#BFDBFE` | 비활성 강조 |

### Text

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `text-primary` | `#111827` | `#F9FAFB` | 제목, 주요 텍스트 |
| `text-secondary` | `#4B5563` | `#D1D5DB` | 본문 |
| `text-tertiary` | `#9CA3AF` | `#9CA3AF` | 보조, 캡션 |
| `text-disabled` | `#D1D5DB` | `#4B5563` | 비활성 |
| `text-inverse` | `#FFFFFF` | `#111827` | 반전 (버튼 위 등) |

### Background

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `bg-base` | `#FFFFFF` | `#111827` | 페이지 배경 |
| `bg-subtle` | `#F9FAFB` | `#1F2937` | 카드, 섹션 배경 |
| `bg-muted` | `#F3F4F6` | `#374151` | 입력 필드, 칩 |
| `bg-elevated` | `#FFFFFF` | `#1F2937` | 떠있는 요소 (모달) |
| `bg-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` | 오버레이 |

### Border

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `border-default` | `#E5E7EB` | `#374151` | 기본 테두리 |
| `border-strong` | `#D1D5DB` | `#4B5563` | 강조 테두리 |
| `border-focus` | `#2563EB` | `#60A5FA` | 포커스 링 |

### System

| 토큰 | 값 | 용도 |
|------|-----|------|
| `success` | `#10B981` | 성공 |
| `success-light` | `#D1FAE5` | 성공 배경 |
| `warning` | `#F59E0B` | 경고 |
| `warning-light` | `#FEF3C7` | 경고 배경 |
| `danger` | `#EF4444` | 에러, 삭제 |
| `danger-light` | `#FEE2E2` | 에러 배경 |
| `info` | `#3B82F6` | 정보 |
| `info-light` | `#DBEAFE` | 정보 배경 |

---

## Typography

### Font Family

```css
font-family: "Pretendard", -apple-system, BlinkMacSystemFont,
             "Apple SD Gothic Neo", "Segoe UI", sans-serif;
```

### Scale (반응형)

| 토큰 | Mobile | Desktop | Weight | Line Height |
|------|--------|---------|--------|-------------|
| `display` | 32px | 48px | 700 | 1.2 |
| `title-lg` | 24px | 32px | 700 | 1.3 |
| `title-md` | 20px | 24px | 600 | 1.4 |
| `title-sm` | 17px | 19px | 600 | 1.4 |
| `body-lg` | 16px | 17px | 400 | 1.6 |
| `body` | 15px | 16px | 400 | 1.6 |
| `body-sm` | 14px | 14px | 400 | 1.5 |
| `caption` | 12px | 13px | 400 | 1.5 |
| `label` | 13px | 14px | 500 | 1.4 |

### Font Weight

| 토큰 | 값 | 용도 |
|------|-----|------|
| `regular` | 400 | 본문 |
| `medium` | 500 | 라벨, 강조 |
| `semibold` | 600 | 제목 |
| `bold` | 700 | 대제목 |

---

## Spacing (8px 기반)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `space-1` | 4px | 최소 간격 |
| `space-2` | 8px | 아이콘-텍스트 |
| `space-3` | 12px | 요소 내부 |
| `space-4` | 16px | 기본 패딩 |
| `space-5` | 20px | 컴포넌트 간격 |
| `space-6` | 24px | 카드 패딩 |
| `space-8` | 32px | 섹션 간격 |
| `space-10` | 40px | 큰 섹션 |
| `space-12` | 48px | 페이지 여백 |

---

## Rounded (Apple 스타일 - 큰 래디어스)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `rounded-sm` | 6px | 작은 요소, 칩 |
| `rounded-md` | 10px | 버튼, 입력 |
| `rounded-lg` | 14px | 카드 |
| `rounded-xl` | 20px | 모달, 대형 카드 |
| `rounded-full` | 9999px | 원형 (아바타, 태그) |

---

## Elevation (부드러운 그림자)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 미세한 구분 |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | 카드, 호버 |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | 드롭다운, 팝오버 |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.16)` | 모달 |

### 호버 Lift 효과

```css
/* 카드 호버 시 */
transform: translateY(-2px);
box-shadow: var(--shadow-md);
```

---

## Motion (부드러운 전환)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `duration-fast` | 150ms | 즉각 반응 (호버) |
| `duration-normal` | 250ms | 기본 전환 |
| `duration-slow` | 400ms | 큰 변화 (모달) |
| `ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | 기본 |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | 등장 |
| `ease-in` | cubic-bezier(0.4, 0, 1, 1) | 퇴장 |

### 전환 프리셋

```css
--transition-colors: color, background-color, border-color 150ms ease;
--transition-transform: transform 250ms ease-out;
--transition-shadow: box-shadow 250ms ease;
--transition-all: all 250ms ease;
```

---

## Breakpoints

| 토큰 | 값 | 설명 |
|------|-----|------|
| `screen-sm` | 480px | 모바일 |
| `screen-md` | 768px | 태블릿 |
| `screen-lg` | 1024px | 데스크톱 |
| `screen-xl` | 1280px | 대형 화면 |

### 반응형 전략

```
Mobile First:
base     → 모바일 (0-479px)
sm       → 큰 모바일 (480px+)
md       → 태블릿 (768px+)
lg       → 데스크톱 (1024px+)
xl       → 대형 (1280px+)
```

---

## CSS 변수 예시

```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #EFF6FF;

  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-tertiary: #9CA3AF;

  --color-bg-base: #FFFFFF;
  --color-bg-subtle: #F9FAFB;
  --color-bg-muted: #F3F4F6;

  --color-border-default: #E5E7EB;
  --color-border-focus: #2563EB;

  /* Typography */
  --font-family: "Pretendard", -apple-system, sans-serif;
  --font-size-body: 16px;
  --line-height-body: 1.6;

  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;

  /* Rounded */
  --rounded-md: 10px;
  --rounded-lg: 14px;

  /* Shadow */
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);

  /* Motion */
  --duration-normal: 250ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #F9FAFB;
    --color-text-secondary: #D1D5DB;
    --color-bg-base: #111827;
    --color-bg-subtle: #1F2937;
    --color-border-default: #374151;
  }
}
```

---

*다음 단계: 03-design-md에서 DESIGN.md 작성*
