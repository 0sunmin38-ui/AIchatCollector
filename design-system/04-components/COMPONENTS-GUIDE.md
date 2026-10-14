# 컴포넌트 가이드

> 토큰을 조합한 UI 컴포넌트 스펙을 정의합니다.

---

## 컴포넌트란?

```
토큰 (색상, 폰트, 간격)
    ↓ 조합
컴포넌트 (버튼, 입력, 카드)
    ↓ 조합
패턴 (검색바, 폼, 리스트)
```

컴포넌트 = **재사용 가능한 UI 단위**

---

## 필수 컴포넌트

### 1. Button (버튼)

| 변형 | 용도 |
|------|------|
| Primary | 주요 액션 (저장, 확인, 제출) |
| Secondary | 보조 액션 (취소, 이전) |
| Tertiary | 약한 액션 (더보기, 옵션) |
| Danger | 위험 액션 (삭제, 해제) |
| Ghost | 텍스트만 (링크 스타일) |

**정의할 속성:**
- 크기: sm / md / lg / xl
- 상태: default / hover / active / disabled / loading
- 아이콘: 좌측 / 우측 / 단독

### 2. Input (입력)

| 타입 | 용도 |
|------|------|
| Text | 일반 텍스트 |
| Password | 비밀번호 |
| Search | 검색 |
| Textarea | 여러 줄 |
| Select | 선택 |
| Checkbox | 다중 선택 |
| Radio | 단일 선택 |
| Toggle | on/off |

**정의할 속성:**
- 크기: sm / md / lg
- 상태: default / focus / error / disabled / readonly
- 라벨: 상단 / 좌측 / placeholder
- 도움말/에러 메시지

### 3. Card (카드)

**정의할 속성:**
- 크기/비율
- 헤더/바디/푸터 구조
- 그림자/테두리
- 호버 효과
- 클릭 가능 여부

### 4. Badge / Chip (배지/칩)

| 용도 | 예시 |
|------|------|
| 상태 표시 | 성공, 실패, 대기 |
| 카테고리 | 태그, 분류 |
| 카운트 | 알림 숫자 |

---

## 선택 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| Modal | 팝업 대화상자 |
| Toast | 임시 알림 |
| Alert | 인라인 알림 |
| Dropdown | 드롭다운 메뉴 |
| Tabs | 탭 네비게이션 |
| Accordion | 접기/펼치기 |
| Table | 데이터 테이블 |
| Pagination | 페이지네이션 |
| Avatar | 프로필 이미지 |
| Tooltip | 툴팁 |
| Progress | 진행 표시 |
| Skeleton | 로딩 플레이스홀더 |

---

## 컴포넌트 정의 형식

### YAML (DESIGN.md 내)

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    backgroundColorHover: "{colors.primary-hover}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    height:
      sm: "32px"
      md: "40px"
      lg: "48px"
    padding: "0 {spacing.lg}"
    fontSize: "{typography.label-md.fontSize}"
    fontWeight: 600
    transition: "all 150ms ease"
```

### 마크다운 (상세 문서)

```markdown
## Button

### Primary Button

**용도:** 페이지당 1-2개의 주요 액션

**스펙:**
| 속성 | 값 |
|------|-----|
| Background | {colors.primary} |
| Text | {colors.text-inverse} |
| Radius | 6px |
| Height | 40px (md) |

**상태:**
- Hover: 배경색 10% 어둡게
- Active: 배경색 20% 어둡게
- Disabled: 투명도 50%, 클릭 불가

**접근성:**
- 최소 터치 영역: 44x44px
- 포커스 링: 4px outline
```

---

## 상태 정의

모든 인터랙티브 컴포넌트는 다음 상태를 정의:

| 상태 | 설명 |
|------|------|
| Default | 기본 상태 |
| Hover | 마우스 오버 |
| Focus | 키보드 포커스 |
| Active | 클릭 중 |
| Disabled | 비활성화 |
| Loading | 로딩 중 |
| Error | 에러 상태 |
| Success | 성공 상태 |

---

## 반응형 고려사항

```yaml
button:
  height:
    mobile: "44px"   # 터치 영역 확보
    desktop: "40px"

  padding:
    mobile: "0 16px"
    desktop: "0 24px"
```

### 브레이크포인트별 변화

| 컴포넌트 | 모바일 | 데스크톱 |
|----------|--------|----------|
| Button | 전체 너비 | 내용 맞춤 |
| Input | 전체 너비 | 고정/유연 |
| Card | 1열 | 2-3열 |
| Modal | 전체 화면 | 중앙 팝업 |

---

## AI와 작업할 때

### 프롬프트 예시

```
"02-tokens/TOKENS.md를 참고해서
버튼 컴포넌트 (Primary, Secondary, Tertiary)를
모든 상태와 크기별로 정의해줘"
```

```
"현재 프로젝트의 lib/render.mjs를 분석해서
기존 컴포넌트들을 토큰 기반으로 재정의해줘"
```

---

## COMPONENTS.md 템플릿

```markdown
# 컴포넌트 스펙

## Button

### Primary
| 속성 | 값 |
|------|-----|
| bg | {colors.primary} |
| text | #FFFFFF |
| radius | 6px |
| height-md | 40px |

#### 상태
- hover: bg → {colors.primary-hover}
- disabled: opacity 0.5

### Secondary
...

## Input

### Text Input
| 속성 | 값 |
|------|-----|
| bg | {colors.bg-base} |
| border | 1px solid {colors.border} |
| radius | 8px |
| height-md | 48px |

#### 상태
- focus: border → {colors.primary}, shadow 4px
- error: border → {colors.danger}

## Card
...
```

---

## 체크리스트

### 필수
- [ ] Button (Primary, Secondary, Tertiary)
- [ ] Input (Text, Select, Checkbox)
- [ ] Card
- [ ] Badge/Chip

### 각 컴포넌트별
- [ ] 모든 상태 정의 (hover, focus, disabled 등)
- [ ] 크기 변형 (sm, md, lg)
- [ ] 반응형 고려
- [ ] 접근성 (터치 영역, 포커스 링)
