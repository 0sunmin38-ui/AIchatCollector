#!/usr/bin/env node
// 저장소 정리 — 여러 번 돌려도 같은 결과가 나온다.
//   node tidy.mjs --dry     무엇이 바뀔지만 본다
//   node tidy.mjs           실제로 정리한다 (원본은 data/<갤러리>/backup/ 에 남는다)
//
// 하는 일
//   1. 본문도 이미지도 없는 글(목록에서 제목만 본 글)을 지운다.
//      수집 규칙(config.json 의 filter)에 걸리는 글도 지운다. 서재에 담긴 글은 어느 쪽이든 남긴다.
//   2. 같은 글이 여러 줄로 쌓인 JSONL 을 글마다 한 줄로 합친다.
//   3. 예전 파서가 남긴 오류를 고친다.
//      - 말머리 '🎬콘텐🎬콘텐츠' → '🎬콘텐츠'
//      - 글보다 앞선 날짜가 찍힌 댓글 → 한 해 뒤로 (연도 추정 버그)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setDataDir, dataArg, confFile } from './lib/paths.mjs';
import { Store } from './lib/store.mjs';
import { Bookmarks } from './lib/bookmarks.mjs';
import { hasBody } from './lib/crawler.mjs';
import { makeFilter } from './lib/filter.mjs';
import { Glossary } from './lib/glossary.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
setDataDir(ROOT, dataArg(args));
const dry = args.includes('--dry');
const cfg = JSON.parse(fs.readFileSync(confFile(ROOT, 'config.json'), 'utf8'));
const gid = cfg.gallery.id;

const store = new Store(ROOT, gid);
const bmk = new Bookmarks(ROOT, gid);
const lines = fs.readdirSync(store.postsDir).filter((f) => f.endsWith('.jsonl'))
  .reduce((n, f) => n + fs.readFileSync(path.join(store.postsDir, f), 'utf8').split('\n').filter((l) => l.trim()).length, 0);
const all = [...store.load().values()];

const rule = makeFilter(cfg.filter, new Glossary(ROOT));
const n = { lines, posts: all.length, removed: 0, keptBookmarked: 0, head: 0, cmtYear: 0, byRule: {} };

/** '🎬콘텐🎬콘텐츠' 처럼 줄임말 + 원래 이름이 붙은 말머리에서 원래 이름만 남긴다 */
function fixHead(h) {
  const s = String(h || '');
  for (let i = 1; i < s.length; i++) {
    const a = s.slice(0, i), b = s.slice(i);
    if (b.length > a.length && b.startsWith(a)) return b;
  }
  return s;
}

const shiftYear = (iso) => iso.replace(/^(\d{4})/, (y) => String(+y + 1));

const keep = [];
for (const r of all) {
  if (!hasBody(r)) {
    if (bmk.has(r.no)) { n.keptBookmarked++; keep.push(r); }
    else n.removed++;
    continue;
  }
  const h = r.detail?.headtext || fixHead(r.headtext);
  if (h && h !== r.headtext) { r.headtext = h; n.head++; }
  const why = rule.reject(r) || rule.rejectBody(r);
  if (why) {
    if (bmk.has(r.no)) { n.keptBookmarked++; keep.push(r); }
    else n.byRule[why] = (n.byRule[why] || 0) + 1;
    continue;
  }
  const post = Date.parse(r.date || '');
  for (const c of r.comments || []) {
    if (c.date && post && Date.parse(c.date) < post - 864e5) { c.date = shiftYear(c.date); n.cmtYear++; }
  }
  keep.push(r);
}

console.log(`JSONL ${n.lines}줄 · 글 ${n.posts}건`);
console.log(`  제목만 있는 글 삭제   ${n.removed}건`);
if (n.keptBookmarked) console.log(`  서재에 담겨 있어 남김 ${n.keptBookmarked}건`);
for (const [why, c] of Object.entries(n.byRule)) console.log(`  규칙으로 삭제         ${c}건 (${why})`);
console.log(`  말머리 고침           ${n.head}건`);
console.log(`  댓글 연도 고침        ${n.cmtYear}개`);
console.log(`  정리 후               글 ${keep.length}건 · ${keep.length}줄`);
if (dry) { console.log('\n  [dry] 아무것도 바꾸지 않았어요.'); process.exit(0); }

const backup = store.rewrite(keep);
const st = store.state();
store.saveState({ ...st, total_posts: keep.length });
console.log(`\n  원본 백업: ${backup}`);
