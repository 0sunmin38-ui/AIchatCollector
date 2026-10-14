# 아이콘 시스템

> SF Symbols는 네이티브 앱 전용이므로, 웹 프로젝트에서는 대체 라이브러리 사용

---

## 권장 라이브러리

### 1. Lucide (추천)

Feather Icons의 커뮤니티 포크. 깔끔하고 가벼운 UI 아이콘.

| 항목 | 내용 |
|------|------|
| 아이콘 수 | 1,548+ |
| 스타일 | 24px, 2px stroke, rounded cap |
| 라이선스 | ISC (무료 상업 사용) |
| 프레임워크 | React, Vue, Svelte, Solid, Angular |
| 링크 | https://lucide.dev |

**장점:**
- Tree-shakable (필요한 것만 번들)
- 일관된 디자인
- 활발한 업데이트

**설치:**
```bash
npm install lucide-react  # React
npm install lucide-vue    # Vue
```

**사용:**
```jsx
import { X, ChevronLeft, Check, Trash2, Plus } from 'lucide-react';

<X size={20} strokeWidth={2} />
```

---

### 2. Heroicons

Tailwind CSS 팀 제작. Tailwind 프로젝트에 최적.

| 항목 | 내용 |
|------|------|
| 아이콘 수 | ~300 (스타일별) |
| 스타일 | Outline, Solid, Mini (20px), Micro (16px) |
| 라이선스 | MIT |
| 링크 | https://heroicons.com |

**설치:**
```bash
npm install @heroicons/react
```

---

### 3. Phosphor Icons

6가지 굵기 제공. 계층적 디자인에 유용.

| 항목 | 내용 |
|------|------|
| 아이콘 수 | 9,072 (1,500 × 6 weights) |
| 스타일 | Thin, Light, Regular, Bold, Fill, Duotone |
| 라이선스 | MIT |
| 링크 | https://phosphoricons.com |

**장점:**
- 같은 아이콘, 다른 굵기로 계층 표현
- Regular → Bold (선택됨), Fill (활성화)

---

## 권장 아이콘 매핑

### 네비게이션

| 용도 | Lucide | 대체 |
|------|--------|------|
| 닫기 | `X` | `XMark` (Heroicons) |
| 뒤로가기 | `ChevronLeft` | `ArrowLeft` |
| 메뉴 | `Menu` | `Bars3` (Heroicons) |
| 더보기 | `MoreHorizontal` | `EllipsisHorizontal` |
| 검색 | `Search` | `MagnifyingGlass` |

### 액션

| 용도 | Lucide | 대체 |
|------|--------|------|
| 추가 | `Plus` | `PlusCircle` |
| 삭제 | `Trash2` | `Trash` |
| 편집 | `Pencil` | `PencilSquare` |
| 저장 | `Save` | `Check` |
| 공유 | `Share2` | `ArrowUpFromLine` |
| 복사 | `Copy` | `Clipboard` |
| 다운로드 | `Download` | `ArrowDownTray` |

### 상태

| 용도 | Lucide | 대체 |
|------|--------|------|
| 성공 | `Check` | `CheckCircle` |
| 경고 | `AlertTriangle` | `ExclamationTriangle` |
| 에러 | `AlertCircle` | `XCircle` |
| 정보 | `Info` | `InformationCircle` |
| 로딩 | `Loader2` (spin) | `ArrowPath` |

### 폼

| 용도 | Lucide | 대체 |
|------|--------|------|
| 체크박스 | `Check` | `CheckMark` |
| 드롭다운 | `ChevronDown` | `ChevronUpDown` |
| 비밀번호 보기 | `Eye` | `EyeOff` |
| 캘린더 | `Calendar` | `CalendarDays` |

---

## 스타일 가이드라인

### 크기

| 컨텍스트 | 크기 | strokeWidth |
|----------|------|-------------|
| 인라인 텍스트 | 16px | 2 |
| 버튼 아이콘 | 20px | 2 |
| 헤더 아이콘 | 24px | 1.5-2 |
| 빈 상태 | 48-64px | 1.5 |

### 색상

```css
/* 아이콘은 currentColor 상속 */
.icon { color: inherit; }

/* 특정 색상 */
.icon-primary { color: #2563EB; }
.icon-secondary { color: #6B7280; }
.icon-danger { color: #EF4444; }
.icon-success { color: #10B981; }
```

### 정렬

- 텍스트와 함께: `vertical-align: middle` 또는 flex
- 버튼 내부: `gap: 8px`
- 아이콘만: 중앙 정렬

---

## SF Symbols 참고

네이티브 앱 개발 시 SF Symbols 사용.

| 항목 | 내용 |
|------|------|
| 아이콘 수 | 7,000+ |
| 특징 | 9 weights, 3 scales, 애니메이션 |
| 다운로드 | https://developer.apple.com/sf-symbols/ |
| 문서 | https://developer.apple.com/design/human-interface-guidelines/sf-symbols |

**웹에서 SF Symbols 못 쓰는 이유:**
- 라이선스가 Apple 네이티브 앱 전용
- 웹 폰트/SVG 배포 불가

---

## 프로젝트 설정 권장

```javascript
// icons.js - 중앙 관리
export {
  X as IconClose,
  ChevronLeft as IconBack,
  Check as IconCheck,
  Plus as IconAdd,
  Trash2 as IconDelete,
  Search as IconSearch,
  Menu as IconMenu,
  MoreHorizontal as IconMore,
  // ...
} from 'lucide-react';
```

**장점:**
- 아이콘 라이브러리 교체 시 한 곳만 수정
- 일관된 네이밍
- 자동완성 용이
