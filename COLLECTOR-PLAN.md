# 수집기 개편 계획

수집기(갤 콜렉터)를 "무엇을 왜 모으는지 알 수 있고, 모은 건 다 보이고, 필요 없는 건 지우고,
원하는 기준으로 나눠 보는" 도구로 다듬기 위한 작업 지시서다.
Claude Code 에게 맡길 때는 "COLLECTOR-PLAN.md 의 다음 할 일 진행" 이라고 하면 된다.
처음 지시문은 맨 아래 [프롬프트](#프롬프트) 에 그대로 남겨 둔다.

## 최종 목표

**코드를 고치지 않고 웹에서 다 한다.** 수집 → 분류 → 사전 → 태그 → 모아 보기까지,
매번 Claude 에게 코드 수정을 맡기지 않고 웹을 쓰면서 그때그때 직접 고칠 수 있어야 한다.

---

## 결정한 것

| 항목 | 결정 |
|---|---|
| 진행 방식 | 설계를 보여주고 승인받은 뒤 구현. 작은 단계로 나눠 실제 데이터로 확인 |
| 불필요 데이터 | **완전 삭제** + 앞으로 수집 안 함. 서재 글은 보호, 지우기 전에 원본 백업 |
| 제목만 있는 글 | 확인 없이 삭제, 앞으로 저장 안 함 (2026-10-15) |
| 수집 기준 | 지난 수집이 어디까지 봤는지 남기고 거기서부터 이어서. 기준은 글번호(삭제돼도 안 흔들림), 날짜는 같이 기록 |
| 홍보 | 전부 버림. 서비스 홍보도 남기지 않음 (2026-10-15) |
| 잡담 | 제목에 모델·플랫폼·지침·가격·검열 등 키워드가 있을 때만 (2026-10-15) |
| 리뷰 | 본문에 모델·OOC·지침 이야기가 있을 때만. 순수 캐릭터 플레이 썰은 버림 (2026-10-15) |
| 그 밖의 말머리 | 정보·제작·그림·질문·콘텐츠·공식 등은 조건 없이 다 받음. 제목이 평범한 좋은 글이 많아서다 |
| 플랫폼 정식 명칭 | 케덕 · 로판 · 티팟 · 유니 · 엘린 · 루모 · 우마이. 나머지 표기는 별칭 (2026-10-15) |
| 모델 태그 | 젬4 · 젬이오 · 젬3.8 · 젬3.7 · 젬3.6 · 오푸스 · 소넷 · 페이블 · 클로드 · 아르곤 · GPT · 딥시크 · GLM. 그림 모델(NAI · PixAI)은 따로 |

## 진행 상황

- [x] 1단계 진단 — 보고서 `.local/phase1-diagnosis.md`
- [x] 진단 버그 4건 수정 — 서재 이미지 경로, 댓글 연도, 말머리 중복, 한 글자 은어 감지
- [x] 제목만 있는 글 980건 삭제, 앞으로 본문 있는 글만 저장 (`tidy.mjs`)
- [x] 이어받기 수집 — `coverage.json` 에 처리한 글번호 구간을 남기고 다음 수집은 거기서부터. `daily` 에 적용
- [x] 수집 규칙(`config.json` 의 `filter`) — 홍보 버림, 잡담은 제목 키워드, 리뷰는 본문 키워드. 저장분도 같은 규칙으로 정리
- [x] 태그 — 플랫폼 · 모델 · 그림. 수집 페이지의 태그 줄에서 섞어 고르기 (`lib/tags.mjs`)

저장 글 수: 1,716 → 736(제목만 삭제) → 404(홍보·잡담 규칙) → 382(리뷰 규칙). 백업은 데이터 폴더 `aichatting/backup/`.

---

## 다음 할 일

순서대로 진행한다. 각 항목은 설계를 먼저 보여주고 승인받는다.

### 1. 큰 탭 — 채팅 / 그림

수집 페이지를 먼저 **채팅**과 **그림** 두 탭으로 나누고, 각 탭 안에서 태그로 다시 나눠 본다.

| 탭 | 들어가는 글 | 탭 안의 태그 묶음 |
|---|---|---|
| 채팅 | 그림 탭에 들지 않는 글 전부 | 플랫폼 · 대화 모델 · 주제(지침 · OOC · 상태창/위젯 · 가격 · 검열 · 출력량 · 기억/요약 …) |
| 그림 | 그림 말머리 글 + 그림 태그가 붙은 글 | 그림 모델(NAI · PixAI …) · 기법(그깎 · 작태 · 그뽑 · 로라 · 에셋 · 그림체) · 플랫폼 |

- 탭은 수집할 때 정해지는 기준(말머리 + 사전 분류)으로 자동으로 나뉜다. 사전이 바뀌면 다시 계산된다.
- 정할 것: 채팅 이야기와 그림 이야기가 섞인 글은 두 탭 모두에 보일지, 한쪽에만 보일지.
- 지금 화면의 "분류" 줄(위젯 · OOC · 지침 · 이미지 프롬 · 그깎 · 확장 · 홍보)은 각 탭의 주제 태그로 흡수하고 없앤다.

### 2. 웹에서 사전 = 태그 관리 (코드 수정 없이)

**사전에 단어를 넣으면 그게 곧 태그가 된다.** 웹의 사전 페이지에서 고치면 수집 페이지 태그에 바로 반영된다.

- 사전 페이지에서 할 수 있어야 하는 것
  - 새 태그(표제어) 추가: 이름 · 묶음(플랫폼 / 대화 모델 / 그림 모델 / 주제 / 기법 …) · 어느 탭(채팅 / 그림) · 별칭
  - 별칭 추가·삭제. 변형 표기를 정식 명칭으로 모으는 일(`잼4` → 젬4)
  - 이름 바꾸기, 두 표제어 합치기(지금 `롶푸스` `케푸스` → 오푸스 처럼)
  - 찾는 방식 옵션: 낱말 경계에서만 찾기(`boundary`), 표제어 자체는 찾지 않기(`match_self`). 화면에서는 쉬운 말로 보여준다
  - 태그 묶음 자체를 추가: 새 분류를 만들면 수집 페이지에 새 태그 줄이 생긴다
- 수집 페이지에서 할 수 있어야 하는 것
  - 글 카드에서 태그를 직접 붙이고 떼기. 손으로 고친 태그가 자동 태그보다 우선한다(`labels.json` 을 태그 여러 개 담게 넓힌다)
  - 태그 칩을 눌러 그 태그의 사전 항목으로 바로 가기
- 수집 규칙도 웹에서: 받지 않을 말머리, 잡담·리뷰 키워드 조건을 사전·설정 화면에서 고친다. 지금은 `config.json` 을 직접 고쳐야 한다

### 3. 사전 자동 수집·분류 — 웹이 먼저 하고, 나는 고치기만

지금은 채굴(`mine`)이 후보 단어만 올리고, 분류와 확정은 전부 사람이 한다. 이걸 웹이 기본값까지 정해 두는 쪽으로 바꾼다.

- 수집이 끝날 때마다(웹의 수집 버튼, 정기 실행 모두) 자동으로 채굴한다
- 후보마다 **분류와 정식 명칭을 추정해 둔다**
  - 플랫폼: 제목 앞 대괄호(`[케/팊/유]`)에 자주 오는 말
  - 모델: `X로 돌렸더니`, 버전 숫자(`3.7플`, `4르곤`), 기존 모델 이름과 비슷한 표기(`잼4` ≈ 젬4)
  - 기존 표제어의 변형이면 "별칭으로 추가" 를 제안
- 추정한 후보는 **바로 태그로 쓰되 '자동' 표시를 붙인다.** 사전 페이지에서 한 번 눌러 확정 · 수정 · 기각한다
- 기각한 말은 다시 올라오지 않는다(지금의 `stopwords` 를 그대로 쓴다)
- 정할 것: 자동 추정을 확정 전에 태그로 바로 보여줄지, 확정해야 보여줄지

### 4. 그 밖에 남은 것

- [ ] 정기 실행 등록 — cron 이 없어 마지막 수집이 2026-09-08 이다. 규칙을 적용한 뒤 하루 유입을 보고 `daily` 횟수·상한을 정한다
- [ ] 비어 있는 기간(2026-09-08 ~ 10-14)을 채울지 결정. 채운다면 기간 수집으로 한 번 돌린다
- [ ] 정체를 모르는 표기 — `좊/좁` · `룸` (어느 플랫폼인지), `아르곤` (지금은 모델로 둠). 리루·크랙·제타·바베챗 등 7개 밖 플랫폼을 태그로 둘지
- [ ] 리뷰 규칙의 놓침 — 본문에 'OOC' 라는 말 없이 OOC 유행을 따라 한 글(글씨체 놀이 등)이 걸러진다
- [ ] 공개 배포(`pages.mjs`)에 갤러리 글 제목이 들어가는 문제 (ISSUES.md)
- [ ] `.local/수집기 - *.csv` 기획 문서(룰 · 기능정의서 · 정보구조도 …)를 읽고 위 설계에 반영

---

## 프롬프트

```
You are a senior engineer working on this repository (AIchatCollector / dcgall): a zero-dependency Node 18+ toolkit that periodically crawls a DCInside gallery (AI채팅 minor gallery), classifies posts, and shows them in a local viewer (serve.mjs: 수집 / 서재 / 사전 pages). Key files: config.json (crawl targets, jobs, rate), crawl.mjs + lib/crawler.mjs + lib/parse.mjs + lib/http.mjs (collection), lib/store.mjs + lib/paths.mjs (storage), taxonomy.json + lib/classify.mjs + lib/labels.mjs (classification), glossary.json + lib/miner.mjs (slang mining), serve.mjs + lib/render.mjs (viewer), scrub.mjs, export.mjs, pages.mjs. Read README.md and ISSUES.md first.

## Goal
Turn the collector into a system where I can (1) understand exactly what gets collected and why, (2) trust that everything collected is visible, (3) remove what I don't need permanently, and (4) organize and browse posts by criteria I define.

## Problems to solve
1. Transparency: I can't tell what format or criteria the crawler uses (which boards/tabs, keyword filters, pagination depth, date range, which fields are saved, how body/comments/images are fetched).
2. Visibility: I'm not sure every collected item actually shows up in the viewer (filters, pagination, failed parses, or classifier output might hide items silently).
3. Pruning: I need to permanently delete unwanted data and stop collecting it in the future. This does not exist today.
4. Classification: I need to organize posts along multiple independent axes, for example:
   - service platform (e.g. specific AI chat services)
   - model used (e.g. Gemini "젬" vs. Claude Opus "오푸스", and others)
   - topic (e.g. image/그림-related, prompts, bots, complaints)
   Then filter, combine, and sort by these axes in the viewer.

## Work in three phases. Stop and wait for my approval at the end of Phases 1 and 2.

### Phase 1: Diagnosis (read-only; no code changes)
Trace the full pipeline from config.json through fetching, parsing, storage, classification, and rendering. Produce a report covering:
- The crawl spec as it actually behaves: targets, triggers, filters, limits, dedup rules, what is saved per post (field-by-field schema), and where it is stored on disk.
- How classification works today: the structure of taxonomy.json, how labels are assigned, and whether a post can carry several labels on different axes.
- A visibility audit: write and run a small read-only script that counts posts in storage and compares them with what the viewer would show. List every code path where an item could be dropped or hidden, with file:line references and real counts.
- Gaps against problems 1–4 above.
Include a short sample of real stored records (strip nicknames) so I can see the actual data shape.

### Phase 2: Design proposal
Propose a design that reuses existing modules where possible and stays zero-dependency. Cover:
- Rule file: extend taxonomy.json (or add a new file) into a multi-axis schema. Each axis (platform, model, topic, …) has values, and each value has keywords/aliases (including gallery slang from glossary.json), match fields (title/body/comments), and priority. Show a concrete example JSON with platform, model (젬/오푸스 etc.), and topic/그림 axes.
- Manual overrides: I can add or remove tags in the viewer, and those edits persist and survive re-classification. Define precedence: manual tag > rule tag.
- Reclassification: one command re-applies the rules to all stored posts after I edit the rule file.
- Viewer: faceted filtering by axis (AND/OR across axes), per-tag counts, an "unclassified" bucket, and a "total collected vs. shown" indicator so nothing is hidden silently.
- Exclusion and permanent deletion:
  - Exclusion rules (keywords, authors-free patterns, categories) live in config. Matching posts are skipped at crawl time.
  - A purge command deletes matching stored posts permanently, including their images and derived indexes.
  - Safety: `--dry-run` is the default and lists what would be deleted. Before any real deletion, create a timestamped backup and require an explicit `--yes`. Never delete posts saved in 서재 (library) unless I pass a separate flag.
  - Record deleted post IDs in a tombstone list so they are never re-collected.
- Crawl transparency: a command (or viewer panel) that prints the effective crawl spec and the stats of the last run (fetched, saved, skipped by rule, failed, and why).
- Migration plan for existing data and the impact on pages.mjs/export.mjs.
List trade-offs and any open questions you need me to answer.

### Phase 3: Implementation (only after I approve the design)
- Implement in small, independently working steps. After each step, run it against real data and report the results.
- Match the existing code style and the design-system docs for any UI changes.
- Keep the 1.2s request interval; do not reduce it. Keep the existing privacy rules (no author IDs or IP fragments).
- Update README.md with how to edit rules, reclassify, exclude, and purge.
- Do not commit; I will review the diff myself.

## Output rules
- Write all reports, explanations, and UI text in Korean. Code identifiers and comments should follow the repository's existing conventions.
- Back every claim about current behavior with file:line references. If something is uncertain, say so instead of guessing.
```
