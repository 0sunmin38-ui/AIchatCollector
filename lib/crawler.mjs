// 수집 로직 — CLI(crawl.mjs) 와 뷰어 서버(serve.mjs) 가 함께 쓴다.
import { Http } from './http.mjs';
import { parseList, parseView, parseComments, SCHEMA_VERSION } from './parse.mjs';
import { Store, mergeRecord } from './store.mjs';

/**
 * 감시 목록의 '@개념:statusboard' 같은 참조를 사전의 실제 표면형으로 편다.
 * 사전에 말을 추가하면 다음 수집부터 그 말도 자동으로 검색된다.
 * 한 글자짜리 표면형(케, 움, 팟…)은 검색어로 쓰면 노이즈만 나와서 뺀다.
 */
export function expandTargets(targets, glos, { max = 60 } = {}) {
  const out = [];
  const seen = new Set();
  for (const t of targets || []) {
    const kw = String(t.keyword || '');
    if (t.mode !== 'search' || !kw.startsWith('@') || !glos) {
      const k = `${t.mode}:${kw}`;
      if (!seen.has(k)) { seen.add(k); out.push(t); }
      continue;
    }
    for (const form of glos.expand([kw])) {
      if (typeof form !== 'string' || form.startsWith('re:')) continue;
      if (form.length < 2) continue;
      const k = `search:${form}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...t, keyword: form, from_ref: kw });
      if (out.length >= max) return out;
    }
  }
  return out.slice(0, max);
}

export const tagOf = (t) =>
  t.mode === 'search' ? `search:${t.searchType || 'search_subject_memo'}:${t.keyword}` : t.mode;

/** 'YYYY-MM-DD' 를 KST 하루의 시작/끝 시각으로 읽는다. 갤러리 글 시각이 KST 라서 그 기준을 따른다. */
export function dayBound(v, edge) {
  if (!v || v === true) return null;
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    const t = Date.parse(v);
    return Number.isNaN(t) ? null : t;
  }
  return Date.parse(`${v}T${edge === 'end' ? '23:59:59' : '00:00:00'}+09:00`);
}

/**
 * 한 번의 수집 실행. onStep 으로 진행 상황을 흘려보낸다.
 * @param {(s:{phase:string,done:number,total:number,label:string})=>void} onStep
 * @param {()=>boolean} shouldStop 중단 요청 확인
 */
export async function runCrawl(ROOT, cfg, opts, onStep = () => {}, shouldStop = () => false) {
  const gallery = { ...cfg.gallery, id: opts.gallery || cfg.gallery.id };
  const job = opts.job ? cfg.jobs[opts.job] : null;
  const rawTargets = job ? job.targets : opts.targets || [];
  const targets = expandTargets(rawTargets, opts.glossary || null);
  const detailCfg = {
    enabled: opts.detail ?? job?.detail?.enabled ?? false,
    onlyRecommend: opts.onlyRecommend ?? job?.detail?.onlyRecommend ?? false,
    maxPosts: Number(opts.maxDetail ?? job?.detail?.maxPosts ?? 30),
    comments: opts.comments ?? job?.detail?.comments ?? true,
    minRecommend: Number(opts.minRecommend ?? 0),
    refresh: !!opts.refresh,
    // 본문 상한 중 최신순으로 채울 몫. 나머지는 추천순으로 백로그를 민다.
    // 0 이면 예전처럼 추천순 한 줄, 1 이면 최신순 한 줄.
    freshShare: Math.min(1, Math.max(0, Number(opts.freshShare ?? job?.detail?.freshShare ?? 0.5))),
    // 저장소에 제목만 남은 글도 후보로 볼지. 끄면 이번 목록에 뜬 글만 본다.
    backlog: (opts.backlog ?? job?.detail?.backlog ?? true) !== false,
  };

  /* ── 기간 지정 ────────────────────────────────────────────
     목록은 최신순이므로, since 보다 오래된 페이지에 닿으면 더 넘길 이유가 없다.
     dedup 은 같은 목록을 여러 번 훑는 기간 수집에서 JSONL 이 부풀지 않게 한다.
     (뷰어는 글번호로 병합해 보여주므로 화면에 두 번 뜨지는 않는다.) */
  const since = dayBound(opts.since, 'start');
  const until = dayBound(opts.until, 'end');
  const ranged = since != null || until != null;
  const dedup = opts.dedup ?? ranged;
  const inWindow = (iso) => {
    if (!ranged) return true;
    const t = Date.parse(iso || '');
    if (Number.isNaN(t)) return false;          // 기간을 걸었으면 날짜 없는 글은 판단할 수 없다
    return (since == null || t >= since) && (until == null || t <= until);
  };

  const runAt = new Date().toISOString();
  const runId = runAt.replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  const http = new Http(cfg.http);
  const store = new Store(ROOT, gallery.id);
  const state = store.state();
  const existing = store.load();

  const collected = new Map();
  const errors = [];
  const logs = [];
  const say = (m) => { logs.push(m); };

  // ── 1단계: 목록 ───────────────────────────────────────────
  const listTotal = targets.reduce((n, t) => n + Number(t.pages || 1), 0);
  let listDone = 0;
  for (const t of targets) {
    const pages = Number(t.pages || 1);
    const tag = tagOf(t);
    for (let p = 1; p <= pages; p++) {
      if (shouldStop()) { say('중단 요청으로 목록 수집을 멈췄어요.'); break; }
      onStep({ phase: 'list', done: listDone, total: listTotal, label: `${tag} ${p}쪽` });
      try {
        const html = await http.fetchList(gallery, t, p);
        const rows = parseList(html, { galleryId: gallery.id, sourceTag: tag, runAt });
        const posts = rows.filter((r) => !r.is_notice || opts.withNotice);
        const keep = posts.filter((r) => inWindow(r.date));
        for (const r of keep) collected.set(r.no, mergeRecord(collected.get(r.no), r));
        say(ranged ? `[목록] ${tag} ${p}쪽 → ${posts.length}건 중 기간 내 ${keep.length}건`
                   : `[목록] ${tag} ${p}쪽 → ${posts.length}건`);
        if (posts.length === 0) { listDone += pages - p + 1; break; }
        // 이 쪽이 통째로 since 이전이면 더 뒤쪽은 볼 필요가 없다
        const dated = posts.filter((r) => r.date && !Number.isNaN(Date.parse(r.date)));
        if (since != null && dated.length && dated.every((r) => Date.parse(r.date) < since)) {
          say(`[목록] ${tag} ${p}쪽이 모두 시작일 이전이라 여기서 멈춰요.`);
          listDone += pages - p + 1;
          break;
        }
      } catch (e) {
        errors.push({ stage: 'list', target: tag, page: p, message: e.message });
        say(`[실패] ${tag} ${p}쪽: ${e.message}`);
      }
      listDone++;
    }
    if (shouldStop()) break;
  }

  // ── 2단계: 본문 + 댓글 ────────────────────────────────────
  let detailDone = 0;
  if (detailCfg.enabled && !shouldStop()) {
    /* 후보 풀 = 이번 목록에서 본 글 + 저장소에 제목만 남아 있는 글.
       목록만 보면 한 번 밀려난 글은 다시 후보가 되지 못해 영영 본문을 못 받는다. */
    const pool = new Map();
    for (const r of collected.values()) pool.set(r.no, r);
    if (detailCfg.backlog) {
      for (const r of existing.values()) {
        if (pool.has(r.no) || r.is_notice) continue;
        if (ranged && !inWindow(r.date)) continue;   // 기간을 걸었으면 그 밖의 밀린 글은 건드리지 않는다
        // 저장소 레코드는 건드리지 않는다. 실제로 받아온 것만 collected 에 넣는다.
        pool.set(r.no, { ...r, from: [...(r.from || [])], crawled_at: runAt, seen_at: runAt });
      }
    }

    const eligible = [...pool.values()].filter((r) => {
      const prev = existing.get(r.no);
      const hasDetail = prev?.detail && (!detailCfg.comments || prev.comments);
      if (hasDetail && !detailCfg.refresh) return false;
      if (detailCfg.onlyRecommend && !(r.from || []).includes('recommend')) return false;
      return (r.recommend || 0) >= detailCfg.minRecommend;
    });

    /* 상한을 추천순 한 줄로 다 쓰면 갓 올라온 글은 추천이 안 쌓여 매번 뒤로 밀린다.
       몫을 갈라 한쪽은 최신순으로 새 글을, 다른 쪽은 추천순으로 백로그를 맡는다. */
    const cap = detailCfg.maxPosts;
    const freshQuota = Math.min(cap, Math.round(cap * detailCfg.freshShare));
    const byFresh = [...eligible].sort((a, b) => b.no - a.no);
    const byRecommend = [...eligible].sort((a, b) => b.recommend - a.recommend || b.no - a.no);

    const picked = new Map();
    const take = (list, n) => {
      for (const r of list) {
        if (n <= 0 || picked.size >= cap) break;
        if (picked.has(r.no)) continue;
        picked.set(r.no, r);
        n--;
      }
    };
    take(byFresh, freshQuota);            // 최신 몫을 먼저 확보하고
    take(byRecommend, cap - picked.size); // 남은 자리를 추천순으로 채운다
    const candidates = [...picked.values()];
    if (detailCfg.backlog) {
      const back = candidates.filter((r) => !collected.has(r.no)).length;
      say(`[본문] 후보 ${eligible.length}건 중 ${candidates.length}건 선정 (최신 몫 ${freshQuota} · 백로그 ${back}건)`);
    }

    for (const r of candidates) {
      if (shouldStop()) { say('중단 요청으로 본문 수집을 멈췄어요.'); break; }
      onStep({ phase: 'detail', done: detailDone, total: candidates.length, label: r.title.slice(0, 30) });
      try {
        const html = await http.fetchView(gallery, r.no);
        const d = parseView(html, { runAt });
        r.detail = d;
        collected.set(r.no, r);   // 저장소에서 끌어온 백로그 글도 이번 실행분으로 저장한다
        if (d.title) r.title = d.title;
        if (d.views != null) r.views = d.views;
        if (d.recommend != null) r.recommend = d.recommend;
        r.comment_count = d.comment_count ?? r.comment_count;

        if (detailCfg.comments && r.comment_count > 0 && d.esno) {
          const all = [];
          const pages = Math.min(Math.ceil(r.comment_count / 100), 10);
          for (let cp = 1; cp <= pages; cp++) {
            const { items } = parseComments(await http.fetchComments(gallery, r.no, d.esno, cp), d.date || r.date);
            if (!items.length) break;
            all.push(...items);
          }
          const seen = new Set();
          r.comments = all.filter((c) => !seen.has(c.no) && seen.add(c.no));
        } else if (detailCfg.comments) r.comments = [];
        detailDone++;
        say(`[본문] ${r.no} 추천${r.recommend} · ${r.title.slice(0, 34)}`);
      } catch (e) {
        errors.push({ stage: 'view', no: r.no, message: e.message });
        say(`[실패] 본문 ${r.no}: ${e.message}`);
      }
    }
  }

  // ── 3단계: 저장 ───────────────────────────────────────────
  const all = [...collected.values()];
  const maxNo = all.reduce((m, r) => Math.max(m, r.no), 0);

  /* 이미 저장된 것과 달라진 게 없으면 다시 쓰지 않는다.
     같은 페이지를 여러 번 훑는 기간 수집에서 같은 글이 계속 쌓이는 걸 막는다.
     조회수만 달라진 경우는 '달라진 것' 으로 치지 않는다 — 매 실행 늘기 때문이다. */
  const changed = (r) => {
    const prev = existing.get(r.no);
    if (!prev) return true;
    if (r.detail && (!prev.detail || detailCfg.refresh)) return true;
    if (r.comments && !prev.comments) return true;
    return (prev.title || '') !== (r.title || '')
      || (prev.recommend || 0) !== (r.recommend || 0)
      || (prev.comment_count || 0) !== (r.comment_count || 0);
  };
  const records = dedup ? all.filter(changed) : all;
  const skipped = all.length - records.length;
  if (skipped) say(`[저장] 달라진 게 없어 건너뛴 글 ${skipped}건`);
  const newPosts = records.filter((r) => !existing.has(r.no));

  const manifest = {
    run_id: runId, schema: SCHEMA_VERSION,
    started_at: runAt, finished_at: new Date().toISOString(),
    gallery, job: opts.job || null,
    targets: targets.map((t) => ({ ...t, tag: tagOf(t) })),
    detail: detailCfg,
    range: ranged ? { since: opts.since || null, until: opts.until || null } : null,
    dedup,
    counts: { seen: all.length, saved: records.length, skipped, new: newPosts.length, details: detailDone },
    http: http.stats, errors, dry: !!opts.dry, source: opts.source || 'cli',
  };

  if (!opts.dry) {
    store.append(records);
    store.saveRun(manifest);
    store.saveState({
      last_no: Math.max(state.last_no || 0, maxNo),
      last_run: runId, last_run_at: manifest.finished_at,
      runs: (state.runs || 0) + 1, total_posts: store.load().size,
    });
  }
  return { manifest, logs, records: all.length, saved: records.length, skipped, newCount: newPosts.length, detailDone, errors };
}
