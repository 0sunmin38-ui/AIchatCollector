// 글마다 태그를 붙인다 — 사전(glossary)의 은어를 찾아 분류(type)별로 모은다.
// 태그는 저장하지 않고 화면을 그릴 때마다 계산한다. 사전을 고치면 저장된 글 전체에 바로 반영된다.
//   플랫폼  type: platform   케덕 · 로판 · 티팟 · 유니 · 엘린 · 루모 · 우마이
//   모델    type: model      젬4 · 젬이오 · 젬3.7 · 오푸스 …
//   그림    type: imagegen   NAI · PixAI

export const AXES = [
  { key: 'p', type: 'platform', label: '플랫폼' },
  { key: 'm', type: 'model', label: '모델' },
  { key: 'i', type: 'imagegen', label: '그림' },
];

/** 본문은 앞부분만 본다. 긴 리뷰 끝자락에 지나가듯 나온 이름까지 태그로 올리지 않기 위해서다. */
const BODY_CHARS = 3000;

/** @returns {{p:string[], m:string[], i:string[]}} 표제어 목록 */
export function tagsOf(post, glos) {
  const text = (post.title || '') + '\n' + String(post.detail?.body_text || '').slice(0, BODY_CHARS);
  const out = Object.fromEntries(AXES.map((a) => [a.key, []]));
  for (const term of glos.detect(text)) {
    const type = glos.data.terms[term]?.type;
    const ax = AXES.find((a) => a.type === type);
    if (ax) out[ax.key].push(term);
  }
  return out;
}

/** 사전에 정의된 순서대로 축별 표제어 목록 (화면의 칩 순서) */
export function axisTerms(glos) {
  return Object.fromEntries(AXES.map((a) => [a.key,
    Object.entries(glos.data.terms).filter(([, v]) => v.type === a.type).map(([k]) => k)]));
}
