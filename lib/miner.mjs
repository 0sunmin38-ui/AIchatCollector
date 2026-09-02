// 은어 채굴 로직 — CLI(mine.mjs) 와 뷰어 서버(serve.mjs) 가 함께 쓴다.
import { Store } from './store.mjs';

// 한국어 일반어 씨앗 목록. 기각한 말은 glossary.stopwords 에 영구히 쌓인다.
export const SEED_STOP = `그리고 그래서 그런데 하지만 그러면 그러니까 진짜 너무 정말 완전 대박 이거 저거 그거 여기 저기 거기
지금 아까 나중 오늘 어제 내일 요즘 요새 예전 처음 마지막 다음 이제 아직 벌써 이미 계속 자꾸 다시 또한 역시 그냥 아니 맞아
사람 사람들 우리 내가 니가 네가 자기 본인 다들 모두 전부 혼자 서로 거야 거임 건가 건데 는데 인데 한테 에게
있어 있는 있다 있음 없어 없는 없다 없음 하는 하다 한다 했어 했다 하고 해서 하면 되는 된다 됐어 되고 보면 보니 봤어
같은 같다 같아 같은데 어떻게 어떤 무슨 왜냐 근데 혹시 만약 제발 아마 살짝 조금 많이 엄청 훨씬 제일 가장 더욱
좋다 좋아 좋은 싫어 미친 개쩐 뭔가 뭐가 이런 저런 그런 이렇게 저렇게 그렇게 새로 오랜만에 간만에
질문 추천 공유 후기 리뷰 안내 공지 이벤트 업뎃 업데이트 버전 사용 문제 상황 방법 기능 관련 내용 정도 부분 이유
갤러 갤러리 갤럼 형들 얘들 애들 님들 여러분 궁금 감사 죄송 부탁 도움 생각 마음 기분 느낌 얘기 이야기 소리 말이
하나 둘셋 몇개 개월 정말로 이번 저번 다른 새로운 비슷 여러 각각 전체 일단 결국 역시나 심지어 특히 물론
아무리 그대로 자주 함께 그만 별로 별거 애초에 자체 갑자기 도대체 무조건 확실히 오히려 대체 솔직히 나만 나는 나도
개인 개인적 소신발언 필독 주의 등등 말고 전에 앞으로 지금까지 드디어 안녕하세요 얘들아 갤루들아 시간이
기본 제작 제작자 의견 상태 원래 정리 설정 규칙 이름 특정 분위기 요약 전용 말투 운영 대화 채팅 이미지 표현 설명
컨셉 항목 보상 검열 묘사 홍보 교육 모음 차이 한국 반영 태그 사이트 로그 폰트 비율 최근 동물 조합 공개 신규 댓글
기념 규정 규제 프로그램 유저 개발자 공모전 투표 논란 사과문 가이드 명령어 제한 기준 테스트 범용 최종 서사 세계관
나이 남자 여자 상황 마감 언급 캐릭터 플랫폼 출력 그림 글씨체 대형 주간 사내 여인 장발 오빠 아저씨 대문 도파민
위해 대해 위하여 이건 그건 저건 사실 보고 직접 거의 아예 같이 절대 이상 이하 추가 시리즈 하루 바로 굳이 나름 링크
번역 모바일 방향 비교 자료 분명 눈치 진심 소소 빨리 단위 일본 점검 통일 선물 초안 소식 만원 영원 비밀 신생 개편
소원 아이돌 하우스 레전드 상금 고급 현피 재업 보따리 발로 애증 커뮤니티 여성향 로맨스 로코 피폐 근친 자유 이것저것
전반 최고 세상 얼굴 어깨 언제 미안 조심 시원 아름 멀쩡 고능 다인 갤러들 제작자들 남자들 신작탭 초보작자 뻘글`
  .split(/\s+/).filter(Boolean);

/* ── 일반어를 형태로 걸러낸다 ──────────────────────────────
   SEED_STOP 은 정확일치라서 어간만 막는다. 한국어는 어미가 무한히 붙으므로
   "있다" 를 막아도 "있는데·있으면·있을까" 가 계속 새로 뚫린다.
   그래서 활용 어미로 끝나는 말은 형태만 보고 통째로 뺀다. */
const ENDING = new RegExp('(?:' + [
  '는데|은데|으면|면서|려고|아서|어서|해서|하고|하니|더니|다가|거나|든지|지만',      // 연결
  '는가|을까|ㄹ까|는지|을지|나요|세요|어요|아요|네요|군요|구나|잖아|거든|더라',      // 종결·의문
  '았다|었다|겠다|했다|한다|된다|이다|같다|싶다|린다|본다|난다|온다|간다',           // 평서
  '겠음|겠어|싶어|싶은|싶음|주라|줘라|해라|하자|해줘|해도|해서',                    // 청유·양보
  '합니다|입니다|습니다|됩니다',
  '는|던',                                                                        // 관형형 (쓰는·아는·찾는·받던)
  '음|함|김|봄|옴|암|짐|침',                                                       // 명사형 (좋음·공유함·웃김·돌려봄)
  '기',                                                                            // 명사형 (보기·만들기·받기)
  '인데|한데|다고|시다|예요|드립니다|만에|라고|고요',                                // 인용·종결
  '한|인|운|린|진|긴|난|든|웠|었|았',                                              // 관형형 (못한·아름다운·터진·올린)
  '게|히',                                                                         // 부사형 (조심스럽게·영원히)
  '아님|아닌|거라',
].join('|') + ')$');

/* 3음절 이상에서만 재는 어미. 짧은 말에 걸면 은어가 다친다.
   '지·어' 는 카오모지·목적지·애기어 를 잡아먹으므로 일부러 뺐다. */
const SOFT_ENDING = /(?:고|다|나|면|서|아|봐|해|와|져|줘)$/;

/* 조사. 긴 것부터 떼어봐야 "에서" 를 "에"+"서" 로 잘못 자르지 않는다. */
const JOSA = ['에서', '으로', '한테', '에게', '까지', '부터', '보다', '처럼', '마다', '조차', '이나', '라도', '이랑', '에는', '에도', '에만',
  '가', '이', '은', '는', '을', '를', '에', '도', '만', '의', '로', '과', '와', '랑', '께', '나'];

/** 조사를 떼고 남는 어간. 뗄 게 없으면 null */
function stripJosa(w) {
  for (const j of JOSA) if (w.length > j.length && w.endsWith(j)) return w.slice(0, -j.length);
  return null;
}

/**
 * 사람이 볼 필요도 없는 말인가.
 *  - 활용 어미로 끝나면 일반어
 *  - 조사를 떼어낸 어간이 이미 아는 말이면 (케에 = 케 + 에) 새 말이 아니다
 *  - 조사를 떼어낸 어간이 일반어면 (있는데 → 있는) 역시 일반어
 */
export function isNoise(w, glos, stop) {
  if (ENDING.test(w)) return true;
  if (w.length >= 3 && SOFT_ENDING.test(w) && /^[가-힣]+$/.test(w)) return true;
  const stem = stripJosa(w);
  if (!stem) return false;
  if (glos && (glos.has(stem) || glos.matchesPattern(stem))) return true;
  if (stop && stop.has(stem)) return true;
  // 조사를 떼고 한 음절만 남으면 (글을·갤이·너를) 어절을 잘못 자른 것이다.
  // 한 음절짜리 은어는 사전에 이미 있고 바로 위에서 걸러진다.
  return stem.length === 1;
}

/**
 * 빈도가 아니라 특이도로 뽑는다.
 *  1) 태그 자리  — [케/팊/엘] 처럼 대괄호 안에 오면 거의 확실히 고유어
 *  2) 형제 단서  — 같은 태그 묶음에 아는 플랫폼이 있으면 이것도 같은 종류다
 *  3) 슬롯 위치  — 단 [케덕/진도오] 의 뒷칸은 플랫폼이 아니라 캐릭터 이름이므로 감점
 *  4) 제목 등장  — 제목은 군더더기가 없어서 은어 밀도가 높다
 *  5) 본문 편재  — 본문 곳곳에 고르게 퍼진 말은 일반어이므로 감점
 */
export function mine(ROOT, galleryId, glos, { min = 2, limit = 300 } = {}) {
  const STOP = new Set([...SEED_STOP, ...(glos.data.stopwords || [])]);
  const pruned = glos.prune();   // 그 사이 확정·별칭·패턴으로 흡수된 후보를 먼저 치운다
  const posts = [...new Store(ROOT, galleryId).load().values()].filter((p) => !p.is_notice);
  const bodies = posts.filter((p) => p.detail?.body_text).length || 1;

  const titleDF = new Map(), bodyDF = new Map(), tagN = new Map();
  const ex = new Map(), co = new Map(), sib = new Map();
  const bump = (m, k, v = 1) => m.set(k, (m.get(k) || 0) + v);
  const touch = (w) => { if (!ex.has(w)) { ex.set(w, []); co.set(w, new Map()); sib.set(w, new Map()); } };

  const usable = (t) => t && !STOP.has(t) && !glos.has(t) && !glos.matchesPattern(t)
    && !isNoise(t, glos, STOP)
    && glos.data.candidates[t]?.status !== 'rejected' && !/^\d/.test(t);
  const words = (s) => (String(s).match(/[가-힣]{2,6}|[A-Za-z][A-Za-z0-9.]{2,11}/g) || []).map((w) => w.toLowerCase());

  for (const p of posts) {
    const title = p.title || '';
    const body = (p.detail?.body_text || '').slice(0, 4000);
    const known = glos.detect(title + '\n' + body);

    /* 말머리는 [대괄호] 와 【검은괄호】 뿐이다. (소괄호) 는 대개 배포글의 옵션 나열이라
       — [위젯] 레트로 애니콜 폰 st (기본/핑크/하늘) — 태그 가중치를 주면 안 된다.
       소괄호 안 단어도 제목 단어로는 아래에서 세므로 사라지지는 않는다. */
    for (const m of title.matchAll(/[[【]([^\]】]{1,24})[\]】]/g)) {
      const parts = m[1].split(/[/|,]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
      const resolved = parts.map((x) => glos.surface.get(x) || null);
      const knownSibs = resolved.filter(Boolean);
      const leadIsPlatform = resolved[0] && glos.data.terms[resolved[0]]?.type === 'platform';
      parts.forEach((t, idx) => {
        if (!usable(t) || !/^[가-힣a-z]{1,12}$/.test(t)) return;
        touch(t); bump(tagN, t);
        if (leadIsPlatform && idx > 0) { bump(sib.get(t), '__npc__'); return; }
        for (const k of knownSibs) bump(sib.get(t), k);
      });
    }
    for (const t of new Set(words(title))) {
      if (!usable(t)) continue;
      touch(t); bump(titleDF, t);
      if (ex.get(t).length < 4) ex.get(t).push(title.slice(0, 58));
      for (const k of known) bump(co.get(t), k);
    }
    for (const t of new Set(words(body))) {
      if (!usable(t)) continue;
      touch(t); bump(bodyDF, t);
      for (const k of known) bump(co.get(t), k);
    }
  }

  const typeOf = (w) => {
    const s = [...sib.get(w).entries()].sort((a, b) => b[1] - a[1])[0];
    if (!s) return null;
    if (s[0] === '__npc__') return { type: 'role', from: '플랫폼/이름 형식', npc: true };
    const t = glos.data.terms[s[0]]?.type;
    return t ? { type: t, from: s[0] } : null;
  };

  const ranked = [...new Set([...titleDF.keys(), ...tagN.keys()])]
    .map((w) => {
      const tdf = titleDF.get(w) || 0, bdf = bodyDF.get(w) || 0, tg = tagN.get(w) || 0;
      const spread = bdf / bodies;
      const general = spread > 0.15 ? (spread - 0.15) * 40 : 0;
      const guess = typeOf(w);
      const score = tg * 8 + tdf * 2 + Math.min(bdf, 6) * 0.3 + (guess ? (guess.npc ? -10 : 6) : 0) - general;
      const ctx = [...co.get(w).entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
      return { w, n: tdf + tg, tdf, bdf, tg, guess, ctx, ex: ex.get(w), score: Math.round(score * 10) / 10 };
    })
    .filter((r) => r.score > 0 && r.n >= min)
    .sort((a, b) => b.score - a.score);

  const found = {};
  for (const r of ranked.slice(0, limit)) {
    found[r.w] = {
      count: r.n, score: r.score, in_tag: r.tg,
      guess_type: r.guess?.type || null, guess_from: r.guess?.from || null,
      context: r.ctx, examples: r.ex, last_seen: new Date().toISOString(),
    };
  }
  const added = glos.addCandidates(found);
  return { ranked, added, pruned, posts: posts.length };
}
