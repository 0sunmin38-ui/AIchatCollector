# 컴포넌트 스펙

> 토큰을 조합한 재사용 가능한 UI 컴포넌트

---

## Button

### Primary Button

주요 액션. 페이지당 1-2개 권장.

| 속성 | 값 |
|------|-----|
| Background | `#2563EB` (primary) |
| Background (hover) | `#1D4ED8` (primary-hover) |
| Text | `#FFFFFF` |
| Border Radius | `10px` |
| Padding | `12px 24px` |
| Font Size | `15px` |
| Font Weight | `500` |
| Height | `44px` |

**상태:**
- Hover: 배경 어둡게 + `translateY(-1px)` + `shadow-md`
- Active: 배경 더 어둡게 (`#1E40AF`)
- Disabled: `opacity: 0.5`, 클릭 불가
- Loading: 스피너 표시

### Secondary Button

보조 액션.

| 속성 | 값 |
|------|-----|
| Background | `#EFF6FF` (primary-light) |
| Background (hover) | `#BFDBFE` (primary-muted) |
| Text | `#2563EB` (primary) |
| Border | `1px solid #BFDBFE` |
| Border Radius | `10px` |
| Padding | `12px 24px` |

### Tertiary Button

약한 액션, 취소.

| 속성 | 값 |
|------|-----|
| Background | `transparent` |
| Background (hover) | `#F3F4F6` (bg-muted) |
| Text | `#4B5563` (text-secondary) |
| Border | `1px solid #E5E7EB` |
| Border Radius | `10px` |
| Padding | `12px 24px` |

### Danger Button

삭제, 위험 액션.

| 속성 | 값 |
|------|-----|
| Background | `#EF4444` (danger) |
| Background (hover) | `#DC2626` |
| Text | `#FFFFFF` |
| Border Radius | `10px` |

### Ghost Button

텍스트만, 링크 스타일.

| 속성 | 값 |
|------|-----|
| Background | `transparent` |
| Text | `#2563EB` (primary) |
| Text (hover) | `#1D4ED8` |
| Padding | `8px 12px` |

### 크기 변형

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 16px | 13px |
| md | 44px | 12px 24px | 15px |
| lg | 52px | 16px 32px | 16px |

---

## Input

### Text Input

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border | `1px solid #E5E7EB` |
| Border (focus) | `1px solid #2563EB` |
| Border (error) | `1px solid #EF4444` |
| Border Radius | `10px` |
| Padding | `12px 16px` |
| Font Size | `15px` |
| Height | `48px` |
| Focus Ring | `0 0 0 3px #EFF6FF` |

**상태:**
- Default: 회색 테두리
- Focus: 파란 테두리 + 3px 링
- Error: 빨간 테두리
- Disabled: `background: #F9FAFB`, `opacity: 0.7`

### Textarea

| 속성 | 값 |
|------|-----|
| Min Height | `120px` |
| Padding | `16px` |
| Resize | `vertical` |
| 나머지 | Text Input과 동일 |

### Select

| 속성 | 값 |
|------|-----|
| Height | `48px` |
| Padding Right | `40px` (화살표 공간) |
| Arrow | `chevron-down` 아이콘 |
| 나머지 | Text Input과 동일 |

### Checkbox

| 속성 | 값 |
|------|-----|
| Size | `20px` |
| Border | `2px solid #D1D5DB` |
| Border (checked) | `2px solid #2563EB` |
| Background (checked) | `#2563EB` |
| Border Radius | `4px` |
| Check Icon | white, 2px stroke |

### Radio

| 속성 | 값 |
|------|-----|
| Size | `20px` |
| Border | `2px solid #D1D5DB` |
| Border (checked) | `2px solid #2563EB` |
| Inner Dot | `10px`, `#2563EB` |

### Toggle

| 속성 | 값 |
|------|-----|
| Track Width | `48px` |
| Track Height | `28px` |
| Track (off) | `#E5E7EB` |
| Track (on) | `#2563EB` |
| Thumb | `24px`, white, shadow |
| Border Radius | `14px` |
| Transition | `200ms ease` |

---

## Card

### Default Card

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border | `1px solid #E5E7EB` |
| Border Radius | `14px` |
| Padding | `24px` |
| Shadow | none (default) |
| Shadow (hover) | `0 4px 12px rgba(0,0,0,0.08)` |
| Transform (hover) | `translateY(-2px)` |
| Transition | `250ms ease-out` |

### Elevated Card

| 속성 | 값 |
|------|-----|
| Shadow | `0 4px 12px rgba(0,0,0,0.08)` |
| Border | none |
| 나머지 | Default Card와 동일 |

---

## Chip / Badge

### Chip (선택 가능)

| 속성 | 값 |
|------|-----|
| Background | `#F3F4F6` (bg-muted) |
| Background (active) | `#EFF6FF` (primary-light) |
| Text | `#4B5563` (text-secondary) |
| Text (active) | `#2563EB` (primary) |
| Border Radius | `9999px` (full) |
| Padding | `6px 14px` |
| Font Size | `13px` |
| Font Weight | `500` |
| Transition | `150ms ease` |

### Badge (상태 표시)

| Type | Background | Text |
|------|------------|------|
| default | `#F3F4F6` | `#4B5563` |
| success | `#D1FAE5` | `#059669` |
| warning | `#FEF3C7` | `#D97706` |
| danger | `#FEE2E2` | `#DC2626` |
| info | `#DBEAFE` | `#2563EB` |

| 속성 | 값 |
|------|-----|
| Border Radius | `6px` |
| Padding | `4px 10px` |
| Font Size | `12px` |
| Font Weight | `500` |

---

## Modal

### 구조

```
┌─────────────────────────────────────────────────────┐
│  [←/✕]  제목                              [완료/✕]  │  ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│  본문 내용                                          │  ← Body
│                                                     │
├─────────────────────────────────────────────────────┤
│  [버튼1]  [버튼2]  [버튼3]                          │  ← Footer (선택)
└─────────────────────────────────────────────────────┘
```

### 기본 스타일

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border Radius | `20px` |
| Shadow | `0 16px 48px rgba(0,0,0,0.16)` |
| Max Width | `480px` (sm), `640px` (md), `800px` (lg) |
| Overlay | `rgba(0,0,0,0.4)` |
| Animation In | `fade + scale(0.95→1)`, `400ms ease-out` |
| Animation Out | `fade + scale(1→0.95)`, `300ms ease-in` |

### Header

| 속성 | 값 |
|------|-----|
| Height | `56px` |
| Padding | `0 20px` |
| Border Bottom | `1px solid #E5E7EB` |
| Title Font | `17px`, `600` weight |
| Title Align | `center` |

**닫기 버튼 위치:**
- 좌측: 뒤로가기 (← 또는 취소 텍스트)
- 우측: 닫기 (✕) 또는 완료 (✓/텍스트)

### Body

| 속성 | 값 |
|------|-----|
| Padding | `24px` |
| Max Height | `70vh` |
| Overflow | `auto` |

### Footer (선택적)

| 속성 | 값 |
|------|-----|
| Padding | `16px 20px` |
| Border Top | `1px solid #E5E7EB` |
| Gap | `12px` |
| Layout | `flex`, `justify-content: flex-end` |

**버튼 배치 규칙 (Apple HIG):**
- 2버튼: 취소(좌) + 확인(우)
- 3+버튼: Action Sheet 권장
- 위험 액션: 취소 버튼을 bold 처리

### 변형

| 타입 | 용도 |
|------|------|
| Sheet | 하단에서 슬라이드 업 (모바일) |
| Dialog | 중앙 팝업 (데스크톱) |
| Fullscreen | 전체 화면 (복잡한 작업) |

---

## Action Sheet

다중 선택지를 제공하는 모달. 4개 이하 선택지 권장.

### 구조

```
┌─────────────────────────────────────────────────────┐
│  제목 (선택)                                        │
│  설명 (선택)                                        │
├─────────────────────────────────────────────────────┤
│  [🔴 위험한 액션]                    ← 상단 배치     │
│  [선택지 1]                                         │
│  [선택지 2]                                         │
│  [선택지 3]                                         │
├─────────────────────────────────────────────────────┤
│  [취소]                              ← 하단 분리     │
└─────────────────────────────────────────────────────┘
```

### 스타일

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border Radius | `14px` |
| Margin | `8px` (모바일) |
| Animation | slide-up, `300ms ease-out` |

### 버튼 스타일

| 타입 | 색상 | Font Weight |
|------|------|-------------|
| Default | `#2563EB` (primary) | `400` |
| Destructive | `#EF4444` (danger) | `400` |
| Cancel | `#111827` (text) | `600` (bold) |

### 버튼 항목

| 속성 | 값 |
|------|-----|
| Height | `56px` |
| Font Size | `17px` |
| Border Bottom | `1px solid #E5E7EB` |
| Background (hover) | `#F3F4F6` |

---

## Toast / Alert

### Toast (임시 알림)

| 속성 | 값 |
|------|-----|
| Background | `#111827` (dark) |
| Text | `#FFFFFF` |
| Border Radius | `10px` |
| Padding | `14px 20px` |
| Shadow | `0 8px 24px rgba(0,0,0,0.12)` |
| Position | 하단 중앙 또는 우측 상단 |
| Duration | 3초 후 자동 닫힘 |
| Animation | slide-up + fade |

### Alert (인라인 알림)

| Type | Background | Border Left | Icon Color |
|------|------------|-------------|------------|
| info | `#DBEAFE` | `4px #2563EB` | `#2563EB` |
| success | `#D1FAE5` | `4px #10B981` | `#10B981` |
| warning | `#FEF3C7` | `4px #F59E0B` | `#F59E0B` |
| danger | `#FEE2E2` | `4px #EF4444` | `#EF4444` |

| 속성 | 값 |
|------|-----|
| Border Radius | `10px` |
| Padding | `16px 20px` |
| Font Size | `14px` |

---

## Dropdown

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border | `1px solid #E5E7EB` |
| Border Radius | `10px` |
| Shadow | `0 8px 24px rgba(0,0,0,0.12)` |
| Padding | `8px` |
| Animation | `fade + translateY(-4px→0)`, `200ms ease-out` |

### Dropdown Item

| 속성 | 값 |
|------|-----|
| Padding | `10px 14px` |
| Border Radius | `6px` |
| Background (hover) | `#F3F4F6` |
| Font Size | `14px` |

---

## Tooltip

| 속성 | 값 |
|------|-----|
| Background | `#111827` |
| Text | `#FFFFFF` |
| Border Radius | `6px` |
| Padding | `8px 12px` |
| Font Size | `13px` |
| Max Width | `240px` |
| Arrow | 6px 삼각형 |
| Delay | 500ms |
| Animation | `fade`, `150ms` |

---

## Navigation

### Header

| 속성 | 값 |
|------|-----|
| Background | `#FFFFFF` |
| Border Bottom | `1px solid #E5E7EB` |
| Height | `64px` |
| Padding | `0 24px` |
| Position | `sticky`, `top: 0` |
| Z-index | `100` |

### Nav Link

| 속성 | 값 |
|------|-----|
| Text | `#4B5563` |
| Text (hover) | `#111827` |
| Text (active) | `#2563EB` |
| Font Size | `15px` |
| Font Weight | `500` |
| Padding | `8px 16px` |

---

## 반응형 변형

### 모바일 (< 768px)

| 컴포넌트 | 변화 |
|----------|------|
| Button | 전체 너비 옵션 |
| Input | Height 52px (터치) |
| Modal | 전체 화면, 하단에서 슬라이드 |
| Card | 패딩 20px |
| Dropdown | 전체 너비 |

### 터치 영역

모든 인터랙티브 요소: 최소 **44px** 터치 영역
