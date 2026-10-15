// 수집 규칙 — 어떤 글을 받지 않을지. 수집기(목록 단계)와 tidy.mjs(저장분 정리)가 같은 규칙을 쓴다.
//   config.json 의 filter
//     dropHeads      이 말머리 글은 받지 않는다           예) ["홍보"]
//     keywordHeads   이 말머리 글은 제목에 키워드가 있을 때만 받는다   예) ["잡담"]
//     keywords.types 사전(glossary)에서 키워드로 쓸 분류      예) ["model", "platform"]
//     keywords.terms 사전 밖 키워드. 부분일치, 대소문자 무시. 're:' 로 시작하면 정규식
//     bodyKeywordHeads 이 말머리 글은 본문을 받아 본 뒤, 제목+본문에 bodyKeywords 가 있을 때만 남긴다  예) ["리뷰"]
//     bodyKeywords   { types, terms } — keywords 와 같은 형식
// 말머리는 이모지를 떼고 이름으로 비교한다 ('📢홍보' → '홍보').

const headName = (h) => String(h || '').replace(/[^\p{L}\p{N}]/gu, '');

/** { types, terms } 키워드 정의 → (text) => 걸린 키워드 배열 */
function matcher(kw = {}, glos) {
  const types = new Set(kw.types || []);
  const tests = (kw.terms || []).map((t) => {
    if (t.startsWith('re:')) { const re = new RegExp(t.slice(3), 'i'); return (s) => re.test(s); }
    const low = t.toLowerCase();
    return (s) => s.includes(low);
  });
  return (text) => {
    const low = String(text || '').toLowerCase();
    const hits = [];
    if (glos && types.size) for (const term of glos.detect(low)) if (types.has(glos.data.terms[term]?.type)) hits.push(term);
    if (!hits.length) for (let i = 0; i < tests.length; i++) if (tests[i](low)) { hits.push(kw.terms[i]); break; }
    return hits;
  };
}

export function makeFilter(conf = {}, glos = null) {
  const drop = new Set((conf.dropHeads || []).map(headName));
  const kwHeads = new Set((conf.keywordHeads || []).map(headName));
  const bodyHeads = new Set((conf.bodyKeywordHeads || []).map(headName));

  /** 제목에 걸린 키워드 (없으면 빈 배열) */
  const keywordsIn = matcher(conf.keywords, glos);
  const bodyKeywordsIn = matcher(conf.bodyKeywords, glos);

  /** 받지 않을 글이면 그 이유, 받을 글이면 null */
  const reject = (post) => {
    const h = headName(post.headtext);
    if (drop.has(h)) return `말머리:${h}`;
    if (kwHeads.has(h) && !keywordsIn(post.title).length) return `키워드없음:${h}`;
    return null;
  };

  /** 본문을 받은 뒤의 판단. 받을 글이면 null */
  const rejectBody = (post) => {
    const h = headName(post.headtext);
    if (!bodyHeads.has(h)) return null;
    const text = (post.title || '') + '\n' + (post.detail?.body_text || '');
    return bodyKeywordsIn(text).length ? null : `본문키워드없음:${h}`;
  };

  return { reject, rejectBody, keywordsIn, active: drop.size > 0 || kwHeads.size > 0 || bodyHeads.size > 0 };
}
