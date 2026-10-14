# 디자인 시스템 작업 가이드

> 이 폴더는 디자인 시스템을 구축하고 유지하기 위한 문서 모음입니다.
> AI와 협업할 때 이 README를 먼저 읽히세요.

---

## 폴더 구조

```
design-system/
├── README.md              ← 지금 이 파일 (작업 순서 안내)
├── 01-concept/            ← 컨셉, 톤앤매너
├── 02-tokens/             ← 토큰 가이드 & 정의
├── 03-design-md/          ← DESIGN.md 작성법 & 실제 파일
├── 04-components/         ← 컴포넌트 스펙
├── 05-patterns/           ← 패턴 (컴포넌트 조합)
└── references/            ← 참고 자료 (KRDS 등)
```

---

## 작업 단계별 가이드

### 1단계: 컨셉 / 톤앤매너 설정

| 항목 | 내용 |
|------|------|
| **목표** | 서비스의 성격과 분위기 정의 |
| **참고 문서** | `01-concept/CONCEPT-GUIDE.md` |
| **산출물** | `01-concept/CONCEPT.md` |
| **AI 프롬프트 예시** | "이 서비스의 타겟 사용자와 전달하고 싶은 느낌을 정의해줘" |

**체크리스트:**
- [ ] 타겟 사용자 정의
- [ ] 브랜드 성격 (형용사 3-5개)
- [ ] 전달하고 싶은 감정/인상
- [ ] 경쟁/참고 서비스

---

### 2단계: 토큰 설정

| 항목 | 내용 |
|------|------|
| **목표** | 색상, 폰트, 간격 등 기본 단위 정의 |
| **참고 문서** | `02-tokens/TOKENS-GUIDE.md` |
| **산출물** | `02-tokens/TOKENS.md` |
| **AI 프롬프트 예시** | "컨셉에 맞는 색상 팔레트와 타이포그래피 스케일을 제안해줘" |

**필수 토큰:**
- [ ] Colors: primary, text, background (최소 5개)
- [ ] Typography: title, body, caption (최소 3개)
- [ ] Spacing: sm, md, lg (최소 3개)

**선택 토큰:**
- [ ] Rounded (래디어스)
- [ ] Elevation (그림자)
- [ ] Motion (애니메이션)
- [ ] Breakpoints (브레이크포인트)

---

### 3단계: DESIGN.md 작성

| 항목 | 내용 |
|------|------|
| **목표** | 토큰 + 사용 규칙을 AI가 읽을 수 있는 형태로 문서화 |
| **참고 문서** | `03-design-md/DESIGN-MD-GUIDE.md` |
| **산출물** | `03-design-md/DESIGN.md` → 프로젝트 루트에 복사 |
| **AI 프롬프트 예시** | "토큰을 기반으로 DESIGN.md를 작성해줘" |

**필수 섹션:**
- [ ] YAML 프론트매터 (토큰 정의)
- [ ] Overview (컨셉 요약)
- [ ] Colors (색상 사용 가이드)
- [ ] Typography (폰트 사용 규칙)
- [ ] Layout (간격, 그리드)
- [ ] Components (컴포넌트 기본 규칙)
- [ ] Do's and Don'ts (금지 사항)

---

### 4단계: 컴포넌트 정의

| 항목 | 내용 |
|------|------|
| **목표** | 토큰을 조합한 UI 컴포넌트 스펙 정의 |
| **참고 문서** | `04-components/COMPONENTS-GUIDE.md` |
| **산출물** | `04-components/COMPONENTS.md` |
| **AI 프롬프트 예시** | "버튼, 입력, 카드 컴포넌트의 상세 스펙을 정의해줘" |

**필수 컴포넌트:**
- [ ] Button (Primary, Secondary, Tertiary)
- [ ] Input (Text, Select, Checkbox)
- [ ] Card
- [ ] Badge/Chip

**선택 컴포넌트:**
- [ ] Modal
- [ ] Toast/Alert
- [ ] Navigation
- [ ] Table

---

### 5단계: 패턴 정의

| 항목 | 내용 |
|------|------|
| **목표** | 컴포넌트를 조합한 더 큰 UI 단위 정의 |
| **참고 문서** | `05-patterns/PATTERNS-GUIDE.md`, `references/KRDS-GUIDE.md` |
| **산출물** | `05-patterns/PATTERNS.md` |
| **AI 프롬프트 예시** | "검색 바, 필터 영역, 카드 리스트 패턴을 정의해줘" |

**기본 패턴:**
- [ ] 입력 폼
- [ ] 오류 처리
- [ ] 로딩 상태
- [ ] 빈 상태

**서비스 패턴:**
- [ ] 검색 + 필터
- [ ] 목록 + 페이지네이션
- [ ] 상세 보기
- [ ] 선택 + 액션

---

### 6단계: 코드 적용

| 항목 | 내용 |
|------|------|
| **목표** | 정의된 토큰과 컴포넌트를 실제 코드에 반영 |
| **참고 문서** | `DESIGN.md` (프로젝트 루트) |
| **대상 파일** | `lib/render.mjs` (CSS 변수) |
| **AI 프롬프트 예시** | "DESIGN.md를 참고해서 CSS 변수를 업데이트해줘" |

**작업 순서:**
1. [ ] CSS 변수 업데이트
2. [ ] 컴포넌트 스타일 적용
3. [ ] 반응형 브레이크포인트 적용
4. [ ] 다크모드 확인
5. [ ] 빌드 및 테스트

---

## AI와 작업할 때 팁

### 문서 읽기 순서

```
새 작업 시작할 때:
1. README.md (이 파일) → 현재 단계 파악
2. 해당 단계의 GUIDE.md → 작성법 이해
3. 이전 단계 산출물 → 컨텍스트 확보
4. 작업 진행
```

### 효율적인 프롬프트

```
❌ "디자인 시스템 만들어줘"

✅ "design-system/README.md를 읽고,
   현재 2단계(토큰 설정)를 진행해줘.
   01-concept/CONCEPT.md를 참고해서
   색상 팔레트를 제안해줘."
```

### 작업 재개할 때

```
"design-system 폴더를 확인하고,
현재 어느 단계까지 완료됐는지 알려줘.
다음 단계를 진행하자."
```

---

## 현재 진행 상황

| 단계 | 상태 | 마지막 업데이트 |
|------|------|----------------|
| 1. 컨셉 | ✅ 완료 | 2024-10-14 |
| 2. 토큰 | ✅ 완료 | 2024-10-14 |
| 3. DESIGN.md | ✅ 완료 | 2024-10-14 |
| 4. 컴포넌트 | ✅ 완료 | 2024-10-14 |
| 5. 패턴 | ✅ 완료 | 2024-10-15 |
| 6. 코드 적용 | ⬜ 미시작 | - |

---

## 참고 자료

### 폴더 내 문서
- `references/KRDS-Design-Guide.md` - 대한민국 정부 디자인 시스템 (색상, 타이포, 컴포넌트)
- `references/LINKS.md` - 디자인 시스템 참고 링크 모음

### 주요 외부 링크
- [Google Labs DESIGN.md](https://github.com/google-labs-code/design.md) - DESIGN.md 공식 스펙
- [ko/design.md 카탈로그](https://www.getdesign.kr) - 한국 서비스 DESIGN.md 모음
- [Design Systems Repo](https://designsystemsrepo.com/design-systems) - 글로벌 디자인 시스템 200+
- [KRDS 공식](https://www.krds.go.kr) - 대한민국 정부 디자인 시스템
