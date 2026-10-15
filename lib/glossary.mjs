// 은어 사전 로더 — 분류기·마이너·리포트가 공유한다.
import fs from 'node:fs';
import path from 'node:path';
import { confFile } from './paths.mjs';

const PARTICLE = '(?:이랑|에서|한테|까지|부터|보다|처럼|으로|도|는|은|이|가|을|를|로|에|랑|의|만|나|든)?';
// 플랫폼 뒤에 모델 이름이 바로 붙는 표기('케젬사' '롶이오' '팊젬4')를 낱말 끝으로 인정하기 위한 머리말들
const MODEL_HEAD = '젬|잼|이오|삼칠|삼팔|삼육|오푸스|푸스|옾|아르곤|4르곤|소넷|딥시크|페이블';
const esc = (f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class Glossary {
  constructor(root) {
    this.file = confFile(root, 'glossary.json');
    this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    this.index();
  }

  index() {
    // 표면형 -> 표제어. 별칭까지 모두 역인덱스.
    this.surface = new Map();
    this.byConcept = new Map();
    this.byType = new Map();
    this.bounded = new Set();   // 낱말 경계에서만 찾는 표면형
    for (const [term, v] of Object.entries(this.data.terms)) {
      // match_self: false 면 표제어 자체는 찾지 않는다 ('로판' 은 장르 이름이기도 해서 '롶' '로판ai' 로만 찾는다)
      const forms = [...(v.match_self === false ? [] : [term]), ...(v.aliases || [])];
      for (const f of forms) {
        this.surface.set(f.toLowerCase(), term);
        if (f.length === 1 || v.boundary) this.bounded.add(f.toLowerCase());
      }
      if (v.concept) {
        if (!this.byConcept.has(v.concept)) this.byConcept.set(v.concept, []);
        this.byConcept.get(v.concept).push(...forms);
      }
      if (!this.byType.has(v.type)) this.byType.set(v.type, []);
      this.byType.get(v.type).push(...forms);
    }
    this.pats = (this.data.patterns || []).map((p) => ({ ...p, rx: new RegExp(p.re, 'gi') }));
    /* 한 글자 표면형(케·옾·팟·움…)과 boundary: true 인 말('유니')은 부분일치로 찾으면
       '케이크' '움직' '유니버스' 에도 걸린다. 앞뒤가 끊긴 낱말일 때만 인정한다.
       뒤에는 조사 하나('옾도' '케에서')나 모델 이름('케젬사' '롶이오')이 붙어도 된다. */
    this.single = [...this.bounded].map((f) => ({
      term: this.surface.get(f),
      rx: new RegExp(`(?:^|[^가-힣a-z0-9])${esc(f)}${PARTICLE}(?=$|[^가-힣a-z0-9]|${MODEL_HEAD})`),
    }));
  }

  /** taxonomy 의 '@개념:키' / '@분류:타입' / '@패턴:키' 를 실제 단어 목록으로 편다 */
  expand(terms = []) {
    const out = [];
    for (const t of terms) {
      if (typeof t !== 'string' || !t.startsWith('@')) { out.push(t); continue; }
      const [kind, key] = t.slice(1).split(':');
      if (kind === '개념' || kind === 'concept') out.push(...(this.byConcept.get(key) || []));
      else if (kind === '분류' || kind === 'type') out.push(...(this.byType.get(key) || []));
      else if (kind === '패턴' || kind === 'pattern') {
        const p = this.pats.find((x) => x.key === key);
        if (p) out.push('re:' + p.re);
      }
    }
    return [...new Set(out)];
  }

  /** 텍스트에서 사전에 있는 은어를 찾아낸다 (분류 근거 표시·문맥 브리핑용) */
  detect(text = '') {
    const low = String(text).toLowerCase();
    const hits = new Set();
    for (const [form, term] of this.surface) if (!this.bounded.has(form) && low.includes(form)) hits.add(term);
    for (const s of this.single) if (!hits.has(s.term) && s.rx.test(low)) hits.add(s.term);
    for (const p of this.pats) { p.rx.lastIndex = 0; if (p.rx.test(low)) hits.add('@' + p.key); }
    return [...hits];
  }

  get(term) { return this.data.terms[this.surface.get(String(term).toLowerCase())] || null; }
  has(term) { return this.surface.has(String(term).toLowerCase()); }

  /** 패턴에 걸리는 표면형인지 (마이너가 이미 설명된 조어를 후보에서 빼는 데 씀) */
  matchesPattern(word) {
    for (const p of this.pats) { p.rx.lastIndex = 0; if (p.rx.test(word)) return p.key; }
    return null;
  }

  addCandidates(found) {
    const c = (this.data.candidates ||= {});
    let added = 0;
    for (const [word, info] of Object.entries(found)) {
      if (this.has(word) || this.matchesPattern(word)) continue;
      const prev = c[word];
      if (prev) {
        prev.count = info.count;
        prev.examples = info.examples.slice(0, 4);
        prev.last_seen = info.last_seen;
      } else {
        c[word] = { ...info, first_seen: info.last_seen, status: 'pending' };
        added++;
      }
    }
    return added;
  }

  /** 후보를 확정 용어로 승격 */
  promote(word, { type, canon, gloss, aliases = [], concept = null, by = 'user' }) {
    this.data.terms[word] = { type, canon: canon || word, gloss: gloss || '', aliases, concept, confirmed: true, by, at: new Date().toISOString() };
    delete this.data.candidates[word];
    this.index();
    return this;
  }

  reject(word) {
    if (this.data.candidates[word]) this.data.candidates[word].status = 'rejected';
    return this;
  }

  /**
   * 규칙이 걸러낸 말을 기각 상태로 적어 둔다.
   * stopwords 에 넣지 않고 candidates 에 근거와 함께 남기는 이유는,
   * 규칙이 틀렸을 때 사람이 무엇이 왜 죽었는지 보고 되살릴 수 있어야 하기 때문이다.
   */
  autoReject(items, reason) {
    const c = (this.data.candidates ||= {});
    const done = [];
    for (const [word, info] of Object.entries(items)) {
      if (this.has(word)) continue;                    // 이미 확정된 말은 건드리지 않는다
      if (c[word]?.status === 'rejected') continue;    // 이미 기각된 말은 그대로 둔다
      c[word] = { ...(c[word] || info), status: 'rejected', rejected_by: reason, rejected_at: new Date().toISOString() };
      done.push(word);
    }
    return done;
  }

  /**
   * 이미 설명이 끝난 후보를 걷어낸다.
   * 확정하거나 별칭으로 흡수하거나 패턴으로 규칙화하고 나면 그 후보는 물어볼 이유가 없는데,
   * 후보 목록에 그대로 남아 사람에게 다시 판단을 요구한다. (프롬프트·그림체가 그랬다)
   */
  prune() {
    const gone = [];
    for (const w of Object.keys(this.data.candidates)) {
      if (this.has(w) || this.matchesPattern(w)) { delete this.data.candidates[w]; gone.push(w); }
    }
    return gone;
  }

  save() {
    this.data.updated_at = new Date().toISOString();
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2) + '\n', 'utf8');
    return this;
  }
}
