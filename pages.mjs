#!/usr/bin/env node
// GitHub Pages 용 정적 사이트를 docs/ 에 만든다.
//
//   node pages.mjs
//
// Pages 는 정적 파일만 서빙하므로 읽기 전용이다.
// 수집·서재 담기·사전 편집은 안 되고, 모아둔 글을 보는 것과
// 서재 묶음(zip)을 내려받는 것만 된다.
// 남의 글이 담기므로 검색엔진에 잡히지 않게 noindex 와 robots.txt 를 함께 넣는다.
//
// 원본 데이터는 읽기만 한다. 내 서재·메모·태그·사전은 데이터 폴더에 그대로 남고,
// 여기서 만드는 docs/ 는 언제든 다시 만들 수 있는 사본이다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setDataDir, confFile } from './lib/paths.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  [...process.argv.slice(2).join(' ').matchAll(/--([\w-]+)(?:[= ]([^-\s]\S*))?/g)].map((m) => [m[1], m[2] ?? true])
);
setDataDir(ROOT, args.data ? String(args.data) : null);

const { buildReport } = await import('./lib/render.mjs');
const { buildLibrary } = await import('./lib/library.mjs');
const { buildGlossaryPage } = await import('./lib/glossary-page.mjs');
const { buildMdBundle } = await import('./lib/mdzip.mjs');

const outDir = path.resolve(String(args.out || path.join(ROOT, 'docs')));
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

/* ── 서재 묶음 ────────────────────────────────────────────────
   보는 사람이 받아 갈 수 있게 마크다운 zip 을 같이 올린다.
   내려받기 주소가 바뀌면 안 되니 파일 이름은 library.zip 으로 고정하고,
   받는 쪽 파일명만 날짜가 붙은 이름으로 준다. */
const DL = 'library.zip';
const bundle = buildMdBundle(ROOT, {
  gallery: args.gallery, onlyLibrary: true,
  extraNote: ['', '읽기 전용 공개 페이지에서 내려받은 사본입니다.'],
});
fs.writeFileSync(path.join(outDir, DL), bundle.buf);

/* ── 페이지에 박힌 데이터 손보기 ──────────────────────────── */
function rewriteData(html, mutate) {
  const open = html.indexOf('id="data">');
  if (open < 0) return html;
  const start = open + 'id="data">'.length;
  const end = html.indexOf('</script>', start);
  const json = JSON.parse(html.slice(start, end).replace(/<\\\//g, '</'));
  mutate(json);
  const out = JSON.stringify(json).replace(/<\/script/gi, '<\\/script');
  return html.slice(0, start) + out + html.slice(end);
}

/** 공개로 나가는 화면이라 닉네임까지 뺀다. 화면에 안 쓰이는 값이라 잃을 게 없다. */
function stripNames(json) {
  const scrub = (list) => (list || []).forEach((p) => {
    delete p.a; delete p.uid;
    (p.cm || []).forEach((c) => { delete c.n; });
  });
  scrub(json.posts);
  scrub(json.items);
}

/**
 * 서재 화면.
 * 보존해 둔 이미지 파일은 공개본에 올리지 않는다 — 남의 글에 붙은 이미지고,
 * data/ 를 커밋하지 않으니 주소를 남겨봐야 깨진 그림만 나온다. 장수만 남긴다.
 * 대신 내보내기 버튼이 같이 올린 zip 을 내려받도록 주소를 심는다.
 */
function libraryPublic(json) {
  stripNames(json);
  for (const it of json.items || []) {
    if (it.img && it.img.length) { it.imgPub = it.img.length; it.img = []; }
  }
  json.meta.dl = DL;
  json.meta.dlName = bundle.name;
}

const NOINDEX = '<meta name="robots" content="noindex, nofollow, noarchive">\n';
const banner = `<div style="background:#fff4e5;border-bottom:1px solid #f0d9b5;color:#7a5a1e;
 font:13px/1.6 -apple-system,'Apple SD Gothic Neo',sans-serif;padding:9px 20px;text-align:center">
 읽기 전용으로 올린 화면이에요. 서재는 <b>내보내기</b> 로 통째로 받아 갈 수 있고,
 수집·서재 담기·사전 편집은 내 컴퓨터에서 <b>node serve.mjs</b> 로 실행할 때만 됩니다.
</div>`;

const opts = { gallery: args.gallery, server: false,
  days: args.days !== undefined ? Number(args.days) : 0,
  top: args.top !== undefined ? Number(args.top) : 900 };

const pages = [
  ['index.html', buildReport(ROOT, opts), stripNames],
  ['library.html', buildLibrary(ROOT, { gallery: args.gallery, server: false }), libraryPublic],
  ['glossary.html', buildGlossaryPage(ROOT, { server: false }), stripNames],
];

for (const [name, html, mutate] of pages) {
  const out = rewriteData(html, mutate)
    .replace('<meta name="viewport"', NOINDEX + '<meta name="viewport"')
    .replace('<body>', '<body>\n' + banner);
  fs.writeFileSync(path.join(outDir, name), out, 'utf8');
  console.log(`  ${name.padEnd(15)} ${(out.length / 1024).toFixed(0)}KB`);
}
console.log(`  ${DL.padEnd(15)} ${(bundle.buf.length / 1024).toFixed(0)}KB · 서재 ${bundle.count}건 (${bundle.name} 으로 받게 됩니다)`);

fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n', 'utf8');
fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');   // _ 로 시작하는 파일도 그대로 서빙
console.log(`\n  robots.txt · .nojekyll 포함`);
console.log(`  생성 위치: ${outDir}`);
console.log(`  커밋해서 올린 뒤 저장소 Settings → Pages 에서 Branch: main / docs 를 고르세요.`);
