// 수집 범위 장부 — 어떤 목록을 글번호 몇 번부터 몇 번까지 빠짐없이 처리했는지 남긴다.
//   data/<gallery>/coverage.json
//
// 글번호는 늘기만 하고 삭제된 글은 번호만 비므로, 날짜보다 번호가 기준으로 단단하다.
// '처리했다' 는 그 구간에서 목록에 뜬 글을 하나도 빠짐없이 본문까지 받았거나
// (원래 있었거나, 이번에 받았거나), 받으러 갔더니 이미 지워졌다는 뜻이다.
// 다음 수집은 이 구간에 닿으면 목록 넘기기를 멈추고 그 위의 새 글만 처리한다.
import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from './paths.mjs';

export class Coverage {
  constructor(root, galleryId) {
    this.file = path.join(dataDir(root), galleryId, 'coverage.json');
    this.data = this.read();
  }
  read() {
    try { return JSON.parse(fs.readFileSync(this.file, 'utf8')); }
    catch { return { version: 1, updated_at: null, targets: {} }; }
  }

  /** 목록 종류별 처리 구간 [{lo, hi, from, to, runs}] (번호 오름차순) */
  ranges(key) { return this.data.targets[key]?.ranges || []; }

  covered(key, no) { return this.ranges(key).some((r) => no >= r.lo && no <= r.hi); }

  /** 가장 높은 구간의 꼭대기 — 다음 수집이 여기까지 내려오면 멈춘다 */
  top(key) { return this.ranges(key).reduce((m, r) => Math.max(m, r.hi), 0); }

  /** 새로 처리한 구간을 넣고 겹치거나 맞닿은 구간은 합친다 */
  add(key, { lo, hi, from = null, to = null, run = null }) {
    if (!(lo <= hi)) return;
    const t = (this.data.targets[key] ||= { ranges: [] });
    const all = [...t.ranges, { lo, hi, from, to, runs: run ? [run] : [] }].sort((a, b) => a.lo - b.lo);
    const out = [];
    for (const r of all) {
      const last = out[out.length - 1];
      if (last && r.lo <= last.hi + 1) {
        last.hi = Math.max(last.hi, r.hi);
        last.from = [last.from, r.from].filter(Boolean).sort()[0] || null;
        last.to = [last.to, r.to].filter(Boolean).sort().at(-1) || null;
        last.runs = [...new Set([...(last.runs || []), ...(r.runs || [])])].slice(-50);
      } else out.push({ ...r, runs: [...(r.runs || [])] });
    }
    t.ranges = out;
  }

  save() {
    this.data.updated_at = new Date().toISOString();
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2) + '\n', 'utf8');
    return this;
  }
}
