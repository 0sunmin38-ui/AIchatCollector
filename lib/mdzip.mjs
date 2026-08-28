// 마크다운 묶음(zip) 만들기.
//
// 두 곳에서 같은 결과물을 쓴다.
//   export.mjs   내 컴퓨터에서 손으로 내보낼 때
//   pages.mjs    공개 배포에 넣어 남들이 받게 할 때
//
// 어느 쪽이든 작성자 정보(닉네임·uid·IP)와 이미지 파일 사본은 넣지 않는다.
import fs from 'node:fs';
import { confFile } from './paths.mjs';
import { Store } from './store.mjs';
import { Labels } from './labels.mjs';
import { Glossary } from './glossary.mjs';
import { compile, classify } from './classify.mjs';
import { makeZip, safeName } from './zip.mjs';
import { Bookmarks } from './bookmarks.mjs';
import { Archive } from './archive.mjs';

/**
 * @param {string} ROOT 코드 폴더
 * @param {{gallery?:string, onlyLibrary?:boolean, extraNote?:string[]}} opts
 * @returns {{name:string, buf:Buffer, count:number, withBody:number, perCat:Object, files:number}}
 *   name 은 권하는 파일 이름이고, 어디에 쓸지는 부르는 쪽이 정한다.
 */
export function buildMdBundle(ROOT, opts = {}) {
  const cfg = JSON.parse(fs.readFileSync(confFile(ROOT, 'config.json'), 'utf8'));
  const galleryId = opts.gallery || cfg.gallery.id;
  const onlyLib = !!opts.onlyLibrary;

  const taxRaw = JSON.parse(fs.readFileSync(confFile(ROOT, 'taxonomy.json'), 'utf8'));
  const glos = new Glossary(ROOT);
  const tax = compile(taxRaw, glos);
  const store = new Store(ROOT, galleryId);
  const labels = new Labels(ROOT, galleryId);
  const bmk = new Bookmarks(ROOT, galleryId);
  const arc = new Archive(ROOT, galleryId);

  const catLabel = Object.fromEntries(taxRaw.categories.map((c) => [c.key, c.label]));
  catLabel.etc = '기타';

  const crawled = store.load();

  // 서재만 뽑을 때는 북마크를 기준으로 삼는다. 수집 목록에서 밀려났거나
  // 원문이 지워진 글도 보존본으로 남아 있으므로, 그쪽이 빠지면 안 된다.
  const pick = onlyLib
    ? bmk.list().map((b) => {
        const base = crawled.get(b.no) || {};
        const snap = arc.load(b.no);
        return {
          no: b.no,
          title: snap?.title || base.title || `제목 없음 ${b.no}`,
          headtext: snap?.headtext || base.headtext || '',
          date: snap?.date || base.date || null,
          views: snap?.views ?? base.views ?? null,
          recommend: snap?.recommend ?? base.recommend ?? null,
          comment_count: snap?.comment_count ?? base.comment_count ?? 0,
          url: snap?.url || base.url || '',
          detail: snap ? { body_text: snap.body_text } : base.detail || null,
          comments: base.comments || [],
        };
      })
    : [...crawled.values()].filter((p) => !p.is_notice);

  const entries = [];
  const stamp = new Date().toISOString().slice(0, 10);
  const base = `${galleryId}-${stamp}`;
  const perCat = {};
  let withBody = 0;

  for (const p of pick) {
    const snap = arc.load(p.no);
    const body = snap?.body_text || p.detail?.body_text || '';
    const comments = snap?.comments || p.comments || [];
    const auto = classify(p, tax);
    const cat = labels.get(p.no)?.category || auto.category;
    const label = catLabel[cat] || cat;
    perCat[label] = (perCat[label] || 0) + 1;
    if (body) withBody++;

    const L = [];
    L.push(`# ${p.title}`, '');
    L.push(`- 분류: ${label}${p.headtext ? ` · 말머리: ${p.headtext}` : ''}`);
    L.push(`- 작성: ${(p.date || '').replace('T', ' ').slice(0, 16)}`);
    L.push(`- 추천 ${p.recommend ?? '-'} · 조회 ${p.views ?? '-'} · 댓글 ${p.comment_count ?? 0}`);
    if (snap?.gone) L.push(`- **원문이 삭제되어 보존본으로만 남아 있습니다.**`);
    else if (p.url) L.push(`- 원문: ${p.url}`);
    if (snap?.archived_at) L.push(`- 보존: ${snap.archived_at.slice(0, 10)}`);
    L.push('', '---', '');
    L.push(body || '_본문을 수집하지 않았습니다._');

    const said = comments.filter((c) => c.text);
    if (said.length) {
      L.push('', '---', '', `## 댓글 ${said.length}개`, '');
      for (const c of said) L.push(`${c.depth ? '  - ' : '- '}${c.text.replace(/\n/g, ' ')}`);
    }
    if (snap?.local_images?.some((i) => i.file)) {
      L.push('', `_보존된 이미지 ${snap.local_images.filter((i) => i.file).length}장은 zip 에 넣지 않았습니다._`);
    }

    entries.push({
      name: `${base}/${safeName(label, 24)}/${p.no}-${safeName(p.title, 50)}.md`,
      data: L.join('\n') + '\n',
    });
  }

  // 목차
  const idx = [`# ${cfg.gallery.name}`, '', `- 생성 ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    `- 글 ${pick.length}건${onlyLib ? ' (서재에 담은 것만)' : ''}`, `- 본문 있는 글 ${withBody}건`, '', '## 분류별', ''];
  for (const [k, v] of Object.entries(perCat).sort((a, b) => b[1] - a[1])) idx.push(`- ${k} ${v}건`);
  idx.push('', '---', '', '작성자 정보는 담지 않았습니다. 글의 저작권은 각 작성자에게 있습니다.',
    '개인 열람용으로만 쓰고 재배포하지 마세요.');
  for (const line of opts.extraNote || []) idx.push(line);
  entries.unshift({ name: `${base}/README.md`, data: idx.join('\n') + '\n' });

  return {
    name: `${base}${onlyLib ? '-서재' : ''}.zip`,
    buf: makeZip(entries),
    count: pick.length,
    withBody,
    perCat,
    files: entries.length,
  };
}
