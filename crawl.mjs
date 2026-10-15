#!/usr/bin/env node
// dcgall 수집기 — 매 실행이 동일한 경로를 밟도록 job/target 으로만 동작한다.
//   node dcgall/crawl.mjs --job daily
//   node dcgall/crawl.mjs --mode recommend --pages 5 --detail
//   node dcgall/crawl.mjs --mode search --keyword 프롬프트 --pages 3 --detail
//   node dcgall/crawl.mjs --job daily --dry        (저장하지 않고 미리보기)
//   node dcgall/crawl.mjs --job daily --fresh-share 0.5   본문 상한 중 최신순으로 채울 몫
//   node dcgall/crawl.mjs --job daily --no-backlog        저장소의 미수집 글은 건너뛴다
//   node dcgall/crawl.mjs --mode all --pages 40 --since 2026-08-01 --until 2026-08-07 --detail
//                                                 기간을 정해 그 사이 글만 수집
//   node dcgall/crawl.mjs --mode all --incremental --since-days 2 --pages 60 --detail
//                                                 지난번 처리 구간에 이어서 새 글만 (coverage.json)
// 본문을 받은 글만 저장한다. 목록에서 제목만 본 글은 남기지 않는다.
// 실제 수집 로직은 lib/crawler.mjs 에 있고 뷰어의 '수집' 버튼과 공유한다.
import fs from 'node:fs';
import path from 'node:path';
import { setDataDir, dataArg, confFile, dataDir } from './lib/paths.mjs';
import { fileURLToPath } from 'node:url';
import { runCrawl } from './lib/crawler.mjs';
import { Glossary } from './lib/glossary.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const [k, v] = t.slice(2).split('=');
      if (v !== undefined) a[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) a[k] = argv[++i];
      else a[k] = true;
    } else a._.push(t);
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
setDataDir(ROOT, args.data && args.data !== true ? String(args.data) : null);
const cfg = JSON.parse(fs.readFileSync(confFile(ROOT, 'config.json'), 'utf8'));

const jobName = args.job || (args.mode ? null : 'daily');
if (jobName && !cfg.jobs[jobName]) {
  console.error(`알 수 없는 job: ${jobName} (사용 가능: ${Object.keys(cfg.jobs).join(', ')})`);
  process.exit(1);
}

const opts = {
  gallery: args.gallery,
  job: jobName,
  targets: jobName ? null : [{ mode: args.mode || 'all', pages: Number(args.pages || 3), keyword: args.keyword, searchType: args.searchType,
                               incremental: !!args.incremental, sinceDays: args['since-days'] ? Number(args['since-days']) : undefined }],
  detail: args['no-detail'] ? false : (args.detail === true || args.detail === 'true' ? true : undefined),
  onlyRecommend: args['only-recommend'] !== undefined ? args['only-recommend'] !== 'false' : undefined,
  maxDetail: args['max-detail'],
  minRecommend: args['min-recommend'],
  freshShare: args['fresh-share'] !== undefined ? Number(args['fresh-share']) : undefined,
  backlog: args['no-backlog'] ? false : undefined,
  comments: args['no-comments'] ? false : undefined,
  refresh: !!args.refresh,
  since: args.since,
  until: args.until,
  dedup: args['no-dedup'] ? false : (args.dedup ? true : undefined),
  withNotice: !!args['with-notice'],
  dry: !!args.dry,
  source: 'cli',
  glossary: new Glossary(ROOT),
};

const r = await runCrawl(ROOT, cfg, opts, ({ phase, done, total, label }) => {
  process.stdout.write(`\r  [${phase === 'list' ? '목록' : '본문'}] ${done + 1}/${total} ${label.padEnd(40).slice(0, 40)}`);
}, () => false);

process.stdout.write('\r' + ' '.repeat(70) + '\r');
for (const l of r.logs) console.log('  ' + l);
const m = r.manifest;
const range = m.range ? ` · 기간 ${m.range.since || '처음'}~${m.range.until || '지금'}` : '';
const dup = r.skipped ? ` · 중복 건너뜀 ${r.skipped}` : '';
const drop = r.dropped ? ` · 다음으로 미룸 ${r.dropped}` : '';
const exc = r.excluded ? ` · 규칙으로 건너뜀 ${r.excluded}` : '';
console.log(`\n▶ run ${m.run_id}${range} · 목록에서 본 글 ${r.records} (신규 저장 ${r.newCount}${dup}${drop}${exc}) · 본문 ${r.detailDone} · 요청 ${m.http.requests} · 에러 ${r.errors.length}`);
for (const s of m.scans) {
  const why = { covered: '지난 구간에 닿음', since: '기간 끝에 닿음', end: '목록 끝', pages: '쪽수 상한' }[s.stop] || s.stop;
  console.log(`  ${s.tag.padEnd(28)} ${s.pages}/${s.maxPages}쪽 (${why}) · ${s.listed}건`
    + (s.no ? ` · ${s.no[0]}~${s.no[1]}번` : '')
    + (s.date ? ` · ${String(s.date[0]).slice(0, 16)} ~ ${String(s.date[1]).slice(0, 16)}` : '')
    + (s.incremental ? ` · 처리 ${s.handled}/${s.listed}` : ''));
}
if (opts.dry) console.log('  [dry-run] 저장하지 않았습니다.');
else console.log(`  저장: ${path.join(dataDir(ROOT), m.gallery.id)}/  ·  리포트: node report.mjs`);
