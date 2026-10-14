# KRDS 디자인 가이드 (대한민국 정부 디자인 시스템)

> **공식 사이트**: https://www.krds.go.kr
> **문의**: krds@nia.or.kr | 1555-6365 (평일 09:00-18:00)

---

## 목차

1. [디자인 원칙](#디자인-원칙)
2. [색상 시스템](#색상-시스템)
3. [타이포그래피](#타이포그래피)
4. [형태 (Shape)](#형태-shape)
5. [레이아웃 & 그리드](#레이아웃--그리드)
6. [아이콘](#아이콘)
7. [컴포넌트 스펙](#컴포넌트-스펙)
8. [간격 & 래디어스](#간격--래디어스)
9. [모션 토큰](#모션-토큰)
10. [접근성 기준](#접근성-기준)

---

## 디자인 원칙

KRDS는 **3대 설계 원칙**을 따릅니다:

| 원칙 | 설명 |
|------|------|
| **일관성** | 모든 디자인 요소를 통해 시각적 정체성 유지 및 신뢰 제공 |
| **접근성** | 전자정부 웹사이트 품질관리 지침 + W3C WCAG 레벨 AA 준수 |
| **효율성** | 표준 규칙과 규격으로 작업 시간 절약 |

### 7가지 디자인 원칙

1. 사용자 중심의 서비스
2. 모든 사용자를 포용하는 서비스
3. 개별 특성을 고려한 서비스
4. 빠르고 간단한 서비스
5. 쉬운 이해와 사용성
6. 다양한 상황 고려
7. 신뢰성

---

## 색상 시스템

### 60-30-10 비율 원칙

- **60%**: 배경 및 중립 색상
- **30%**: 보조 색상
- **10%**: 주요 기능 색상 (Primary)

### Primary Colors (주요 색상)

| 색상명 | HEX | 용도 |
|--------|-----|------|
| **Government Blue (Primary 50)** | `#256EF4` | 버튼, 활성 링크, 포커스 링 |
| **Primary Deep (Primary 60)** | `#0B50D0` | 텍스트, 누른 상태 |
| **Primary 5** | `#ECF2FE` | 보조 버튼 배경, 정보 패널 |
| **Navy (Secondary)** | `#346FB2` | 사이드 메뉴, 헤더 |
| **Government Red (Point)** | `#D63D4A` | 강조 배지, 중요 알림 |

### Semantic Colors (시스템 색상)

| 타입 | HEX | 용도 |
|------|-----|------|
| **Danger/Critical** | `#DE3412` | 유효성 오류, 필수 필드 |
| **Warning** | `#FFB114` | 경고 배경 (텍스트는 `#9E6A00`) |
| **Success** | `#228738` | 확인, 완료 상태 |
| **Information** | `#0B78CB` | 정보 패널, 아이콘 |

### Neutral Colors (중립 색상)

| 요소 | HEX |
|------|-----|
| Page Background | `#FFFFFF` |
| Body Text | `#1E2124` |
| Subtle Text | `#464C53` |
| Border Strong | `#58616A` |
| Border Subtle | `#B1B8BE` |
| Surface Gray | `#F4F5F6` |
| Disabled Surface | `#CDD1D5` |

### 명도 대비 매직넘버

| 값 | 대비율 | 용도 |
|----|--------|------|
| 40 | 3:1 | 큰 텍스트/그래픽 요소 |
| 50 | 4.5:1 | 일반 텍스트 (AA) |
| 70 | 7:1 | 강화 대비 (AAA) |
| 90 | 15:1 | 선명한 화면 모드 |

---

## 타이포그래피

### 서체

- **표준형**: Pretendard GOV (국문/영문)
- **확장형 권장**: 노토 산스, 나눔 고딕, 스포카 한 산스

### 글자 두께

| 두께 | 값 | 용도 |
|------|-----|------|
| Regular | 400 | 본문, 기본 가독성 |
| Bold | 700 | 제목, 강조 콘텐츠 |

> **제한**: 최대 4가지 두께로 제한 권장

### 줄 간격

- **최소값**: 150% 이상
- **단위**: em/% 등 상대 단위 사용 (px 지양)

### Display (배너/마케팅)

| 스타일 | PC | Mobile | 두께 | 자간 |
|--------|-----|--------|------|------|
| Large | 60px | 44px | 700 | 1px |
| Medium | 44px | 32px | 700 | 1px |
| Small | 36px | 28px | 700 | 1px |

### Heading (제목)

| 스타일 | PC | Mobile | 두께 |
|--------|-----|--------|------|
| H1 (xlarge) | 40px | 28px | 700 |
| H2 (large) | 32px | 24px | 700 |
| H3 (medium) | 24px | 22px | 700 |
| H4 (small) | 19px | 19px | 700 |
| H5 (xsmall) | 17px | 17px | 700 |
| H6 (xxsmall) | 15px | 15px | 700 |

### Body (본문)

| 스타일 | 크기 | 두께 |
|--------|------|------|
| large-bold | 19px | 700 |
| medium-bold | 17px | 700 |
| **medium (기본)** | **17px** | **400** |
| small | 15px | 400 |
| xsmall | 13px | 400 |

> **본문 최소**: 16px 이상 권장

### Label (버튼/입력)

| 스타일 | 크기 | 두께 |
|--------|------|------|
| large | 19px | 400 |
| medium | 17px | 400 |
| small | 15px | 400 |

### 사용 금지 사항

- ❌ 밑줄: 링크 외에는 사용 금지
- ❌ 얇은 두께 (Light, Thin): 명도 대비 어려움
- ❌ 과도한 두꺼운 두께 (Extra Bold): 시각적 피로

---

## 형태 (Shape)

### 래디어스 표준 (2px~12px)

| 토큰 | 값 | 컨테이너 크기 |
|------|-----|---------------|
| Xsmall | 2px | 8×8 ~ 16×16 |
| Small | 4px | 20×20 ~ 32×32 |
| Medium | 6px | 40×40 ~ 64×64 |
| Large | 10px | 72×72 ~ 80×80 |
| Xlarge | 12px | 96×96 ~ 120×120 |

### 계산 공식

```
컨테이너 높이 × 1/8 = 래디어스값 (반올림, 홀수→높은 짝수로)
```

### 가이드

- ✅ 비슷한 크기 요소에 동일 래디어스 적용
- ✅ 컨테이너 크기에 맞게 비율 조정
- ❌ 작은 요소에 50% 적용 금지
- ❌ 콘텐츠 침범 금지

---

## 레이아웃 & 그리드

### 브레이크포인트

| 단계 | 뷰포트 | 칼럼 수 | 마진 |
|------|--------|---------|------|
| small | 360px+ | 4 | 16px |
| medium | 768px+ | 8 | 24px |
| large | 1024px+ | 12 | 24px |
| xlarge | 1280px+ | 12 | 24px |

### 그리드 요소

- **스크린 마진**: 모바일 최소 16px, 대형 화면 24px
- **가터 (칼럼 간격)**: 최소 16px, 최적 24px

### 간격 (8-point grid)

| 토큰 | 값 | 용도 |
|------|-----|------|
| gap-1 | 4px | 최소 간격 |
| gap-3 | 8px | 표준 패딩 |
| gap-5 | 16px | 입력 필드 간격 |
| gap-7 | 24px | 카드 리스트 간격 |
| gap-9 | 32px | 섹션 간격 |
| gap-11 | 40px | 모달 패딩 |

---

## 아이콘

### 기본 사양

| 항목 | 값 |
|------|-----|
| 파일 형식 | SVG |
| 기본 크기 | **24px** |
| 선 두께 | 1.5px ~ 2px (표준: 1.6px) |
| 주요 크기 | 16px, 20px, 24px, 32px, 40px |

### 색상 대비

- 기본 모드: 인접 색상과 **최소 3:1 대비율**
- 선명한 화면 모드: **7:1 대비율**

### 10가지 사용 규칙

1. 단순한 형태 유지
2. 일관된 두께 사용
3. 같은 크기 내 한 가지 두께만 적용
4. 크기별 적절한 래디어스 조정
5. 동작 중요성 반영한 색상 선택
6. Front view 시점 사용
7. Line/Fill 타입 구분
8. 텍스트와 중앙 정렬
9. 텍스트와 매칭된 사이즈만 사용
10. 'Off' 표시: 좌상단→우하단 방향 통일

---

## 컴포넌트 스펙

### Primary Button

```css
background: #256EF4;
color: #FFFFFF;
border: 1px solid #256EF4;
border-radius: 6px;
height: 48px; /* medium */

/* States */
hover: #0B50D0;
focus: #083891;
```

### Secondary Button

```css
background: #ECF2FE;
color: #0B50D0;
border: 1px solid #256EF4;
border-radius: 6px;
height: 48px;
```

### Tertiary Button

```css
background: transparent;
color: #1E2124;
border: 1px solid #58616A;
border-radius: 6px;
height: 48px;
```

### Text Input (Large)

```css
background: #FFFFFF;
border: 1px solid #58616A;
border-radius: 8px;
height: 56px;
padding: 0 16px;

/* Focus */
box-shadow: 0 0 0 4px #256EF4;

/* Error */
border: 2px solid #DE3412;
```

### Select

```css
background: #FFFFFF;
border: 1px solid #58616A;
border-radius: 6px;
height: 56px;

/* Error */
border: 2px solid #AB2B36;
```

### Modal

```css
background: #FFFFFF;
border-radius: 12px;
padding: 40px;
/* backdrop: 0.5 black fade */
```

---

## 간격 & 래디어스

### Spacing Scale

| 토큰 | 값 | 용도 |
|------|-----|------|
| xs | 2px | 최소 |
| sm | 4px | 배지, 작은 버튼 |
| md | 8px | 표준 패딩 |
| base | 16px | 입력 패딩 |
| lg | 24px | 콘텐츠 패딩 |
| xl | 32px | 섹션 간격 |
| xxl | 40px | 모달 패딩 |

### Border Radius

```
2px, 4px, 6px, 8px, 10px, 12px, 1000px (full)
```

---

## 모션 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| Base transition | 400ms ease-in-out | 메뉴, 드롭다운 |
| Fade | 400ms linear | 모달, 투명도 변화 |
| Collapse | 400ms ease | 아코디언, 높이 전환 |
| Reduce motion | 0ms | 접근성 모드 |

---

## 접근성 기준

### 명도 대비

| 등급 | 일반 텍스트 | 큰 텍스트 |
|------|-------------|-----------|
| AA (최소) | 4.5:1 | 3:1 |
| AAA (강화) | 7:1 | 4.5:1 |
| 선명한 화면 | 15:1 (본문), 7:1 (제목) | - |

### 기본 동작

- 색대비 4.5:1 준수
- 4px focus halo
- 사용자 줌 90~150% 지원
- 선명한 화면 모드 기본 제공

### 핵심 원칙

> "정부 블루는 액션 자리에만" — Primary 색상은 액션 표시자로만 사용, 장식 금지

- 색상만으로 정보 전달 금지 (아이콘/텍스트 병행)
- 색각이상자 고려 (적록색맹, 청색맹)
- 모든 인터랙티브 요소에 4px outline focus ring 필수

---

## 적용 대상 분류

| 유형 | 대상 | 적용 범위 |
|------|------|-----------|
| **표준형** | 정부 상징 로고 사용 중앙행정기관 (부/처/청) | 모든 규칙 필수 준수 |
| **확장형** | 독자적 로고 사용 중앙기관 및 공공기관 | 기본 규칙 준수 후 기관 특성 반영 가능 |

---

## 참고 링크

- 🔗 **KRDS 공식 사이트**: https://www.krds.go.kr
- 🎨 **디자인 스타일**: https://www.krds.go.kr/html/site/style/style_01.html
- 🎨 **색상 가이드**: https://www.krds.go.kr/html/site/style/style_02.html
- 📝 **타이포그래피**: https://www.krds.go.kr/html/site/style/style_03.html
- 📐 **형태**: https://www.krds.go.kr/html/site/style/style_04.html
- 📱 **레이아웃**: https://www.krds.go.kr/html/site/style/style_05.html
- 🔣 **아이콘**: https://www.krds.go.kr/html/site/style/style_06.html

---

*이 문서는 KRDS 공식 가이드라인을 기반으로 정리되었습니다.*
*최신 정보는 공식 사이트를 참고하세요.*
