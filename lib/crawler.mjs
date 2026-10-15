// 수집 로직 — CLI(crawl.mjs) 와 뷰어 서버(serve.mjs) 가 함께 쓴다.
import { Http } from './http.mjs';
import { parseList, parseView, parseComments, SCHEMA_VERSION } from './parse.mjs';
import { Store, mergeRecord } from './store.mjs';
import { Coverage } from './coverage.mjs';
import { makeFilter } from './filter.mjs';

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

/** 본문이나 이미지가 있어 화면에 보여줄 게 있는 글인지. 이것만 저장한다. */
export const hasBody = (r) => !!(r?.detail?.body_text || r?.detail?.images?.length);

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
  const cov = new Coverage(ROOT, gallery.id);
  const scans = new Map();     // 목록별로 이번에 무엇을 어디까지 봤는지
  const gone = new Set();      // 본문을 받으러 갔더니 지워진 글
  const empty = new Set();     // 받았지만 본문도 이미지도 없는 글
  const excluded = new Map();  // 수집 규칙(config.filter)에 걸려 받지 않은 글 → 이유
  const rule = makeFilter(cfg.filter, opts.glossary || null);

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
    /* 이어받기(incremental) 목록은 장부에 남은 처리 구간의 꼭대기까지만 내려간다.
       장부가 비어 있으면 sinceDays 일 전까지만 본다. 기간을 직접 주면 이어받기는 쓰지 않는다. */
    const inc = !!t.incremental && !ranged;
    const top = inc ? cov.top(tag) : 0;
    // 처음엔 반드시 날짜 바닥을 둔다. 없으면 1쪽에 고정된 옛 글까지 구간에 들어가 그 사이를 다 본 셈이 된다.
    const floor = inc && !top ? Date.now() - Number(t.sinceDays || 1) * 864e5 : null;
    const scan = { tag, incremental: inc, top, floor, maxPages: pages, pagesRead: 0, stop: 'pages', listed: new Map() };
    scans.set(tag, scan);
    for (let p = 1; p <= pages; p++) {
      if (shouldStop()) { say('중단 요청으로 목록 수집을 멈췄어요.'); break; }
      onStep({ phase: 'list', done: listDone, total: listTotal, label: `${tag} ${p}쪽` });
      try {
        const html = await http.fetchList(gallery, t, p);
        const rows = parseList(html, { galleryId: gallery.id, sourceTag: tag, runAt });
        const posts = rows.filter((r) => !r.is_notice || opts.withNotice);
        let keep = posts.filter((r) => inWindow(r.date));
        if (top) keep = keep.filter((r) => r.no > top);
        if (floor != null) keep = keep.filter((r) => Date.parse(r.date || '') >= floor);
        for (const r of keep) {
          scan.listed.set(r.no, r.date);
          // 규칙에 걸린 글은 본문을 받지 않는다. 장부에는 '처리함' 으로 친다 — 다음에 다시 볼 이유가 없다.
          const why = rule.reject(r);
          if (why) { excluded.set(r.no, why); continue; }
          collected.set(r.no, mergeRecord(collected.get(r.no), r));
        }
        scan.pagesRead = p;
        say(ranged || inc ? `[목록] ${tag} ${p}쪽 → ${posts.length}건 중 대상 ${keep.length}건`
                          : `[목록] ${tag} ${p}쪽 → ${posts.length}건`);
        if (posts.length === 0) { scan.stop = 'end'; listDone += pages - p + 1; break; }
        /* 공지가 아닌데도 1쪽에 고정되는 옛 글이 있다(🔔공지 말머리 등). 한두 건 튀는 글로 멈추면
           새 글을 통째로 놓치므로, 그런 글이 여럿이거나 쪽 전체일 때만 닿았다고 본다.
           경계가 쪽 끝에 걸려 한 쪽을 더 보게 되는 건 괜찮다 — 다음 쪽에서 멈춘다. */
        const enough = (n) => n >= Math.min(3, posts.length);
        if (top && enough(posts.filter((r) => r.no <= top).length)) {
          say(`[목록] ${tag} ${p}쪽에서 지난번 처리 구간(${top}번)에 닿아 멈춰요.`);
          scan.stop = 'covered';
          listDone += pages - p + 1;
          break;
        }
        if (floor != null && enough(posts.filter((r) => Date.parse(r.date || '') < floor).length)) {
          say(`[목록] ${tag} ${p}쪽에서 ${t.sinceDays || 1}일 전에 닿아 멈춰요.`);
          scan.stop = 'since';
          listDone += pages - p + 1;
          break;
        }
        // 이 쪽이 통째로 since 이전이면 더 뒤쪽은 볼 필요가 없다
        const dated = posts.filter((r) => r.date && !Number.isNaN(Date.parse(r.date)));
        if (since != null && dated.length && dated.every((r) => Date.parse(r.date) < since)) {
          say(`[목록] ${tag} ${p}쪽이 모두 시작일 이전이라 여기서 멈춰요.`);
          scan.stop = 'since';
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
    /* 이어받기 목록에서 새로 본 글이 먼저다. 오래된 것부터 받아야 처리 구간이 아래에서부터
       끊김 없이 자라고, 상한에 걸려 멈춰도 다음 수집이 남은 위쪽만 이어서 받는다. */
    const incNos = new Set([...scans.values()].filter((s) => s.incremental).flatMap((s) => [...s.listed.keys()]));
    take(eligible.filter((r) => incNos.has(r.no)).sort((a, b) => a.no - b.no), cap);
    const incPicked = picked.size;
    take(byFresh, freshQuota);            // 최신 몫을 먼저 확보하고
    take(byRecommend, cap - picked.size); // 남은 자리를 추천순으로 채운다
    const candidates = [...picked.values()];
    const back = candidates.filter((r) => !collected.has(r.no)).length;
    say(`[본문] 후보 ${eligible.length}건 중 ${candidates.length}건 선정`
      + (incPicked ? ` (이어받기 ${incPicked}건 · 그 밖 ${candidates.length - incPicked}건)` : ` (최신 몫 ${freshQuota})`)
      + (back ? ` · 예전 저장분 ${back}건` : ''));

    for (const r of candidates) {
      if (shouldStop()) { say('중단 요청으로 본문 수집을 멈췄어요.'); break; }
      onStep({ phase: 'detail', done: detailDone, total: candidates.length, label: r.title.slice(0, 30) });
      try {
        const html = await http.fetchView(gallery, r.no);
        const d = parseView(html, { runAt });
        if (!d.body_text && !d.images.length) {
          // 본문 칸을 못 찾았거나 정말 빈 글이다. 저장하지 않고, 다시 받으러 가지도 않는다.
          empty.add(r.no);
          say(`[본문] ${r.no} 본문도 이미지도 없어 저장하지 않아요 · ${r.title.slice(0, 30)}`);
          continue;
        }
        // 본문을 봐야 판단할 수 있는 규칙(리뷰 등). 걸리면 댓글도 받지 않고 버린다.
        const whyBody = rule.rejectBody({ ...r, detail: d });
        if (whyBody) {
          excluded.set(r.no, whyBody);
          collected.delete(r.no);
          say(`[규칙] ${r.no} 본문에 키워드가 없어 저장하지 않아요 · ${r.title.slice(0, 30)}`);
          continue;
        }
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
        if (e.gone) { gone.add(r.no); say(`[본문] ${r.no} 이미 지워진 글이에요 · ${r.title.slice(0, 30)}`); continue; }
        errors.push({ stage: 'view', no: r.no, message: e.message });
        say(`[실패] 본문 ${r.no}: ${e.message}`);
      }
    }
  }

  // ── 3단계: 저장 ───────────────────────────────────────────
  /* 본문이 있는 글만 저장한다. 목록에서 제목만 본 글은 남기지 않는다 — 화면에 보여줄 게 없고,
     못 받은 글은 처리 구간 밖에 남아 있으니 다음 수집이 다시 찾아온다.
     이미 본문이 있는 글은 목록에서 다시 봤을 때 추천·댓글수를 갱신하려고 저장한다. */
  const seenAll = [...collected.values()];
  const maxNo = seenAll.reduce((m, r) => Math.max(m, r.no), 0);
  const all = seenAll.filter((r) => hasBody(r) || hasBody(existing.get(r.no)));
  const dropped = seenAll.filter((r) => !hasBody(r) && !hasBody(existing.get(r.no)) && !gone.has(r.no) && !empty.has(r.no)).length;
  if (dropped) say(`[저장] 본문 상한에 걸려 이번에 못 받은 ${dropped}건은 저장하지 않아요. 이어받기 목록이면 다음 수집이 받아요.`);

  /* 처리 구간 장부. 목록에 뜬 글을 번호 오름차순으로 훑어 처음 못 받은 글 직전까지만 '처리했다' 로 적는다.
     지난 구간에 닿아서 멈췄다면 그 사이(공지·삭제로 빈 번호)까지 이어 붙인다. */
  const handled = (no) => excluded.has(no) || gone.has(no) || empty.has(no) || hasBody(collected.get(no)) || hasBody(existing.get(no));
  if (excluded.size) {
    const why = {};
    for (const v of excluded.values()) why[v] = (why[v] || 0) + 1;
    say(`[규칙] 받지 않은 글 ${excluded.size}건 · ` + Object.entries(why).map(([k, n]) => `${k} ${n}`).join(' · '));
  }
  const scanReport = [];
  for (const s of scans.values()) {
    const nos = [...s.listed.keys()].sort((a, b) => a - b);
    const rep = {
      tag: s.tag, incremental: s.incremental, pages: s.pagesRead, maxPages: s.maxPages, stop: s.stop,
      listed: nos.length, no: nos.length ? [nos[0], nos.at(-1)] : null,
      date: nos.length ? [s.listed.get(nos[0]), s.listed.get(nos.at(-1))] : null,
      handled: nos.filter(handled).length, claim: null,
    };
    if (s.incremental && nos.length) {
      let hi = null;
      for (const no of nos) { if (!handled(no)) break; hi = no; }
      if (hi != null) {
        rep.claim = { lo: s.stop === 'covered' ? s.top + 1 : nos[0], hi, from: s.listed.get(nos[0]), to: s.listed.get(hi) };
        if (!opts.dry) cov.add(s.tag, { ...rep.claim, run: runId });
      }
      if (s.top && s.stop !== 'covered') {
        say(`[범위] ${s.tag}: ${s.pagesRead}쪽 안에 지난 처리 구간(${s.top}번)까지 닿지 못해 사이가 비어요. pages 를 늘려 주세요.`);
      }
      const left = nos.length - rep.handled;
      say(`[범위] ${s.tag}: ${nos[0]}~${nos.at(-1)}번 ${nos.length}건 중 ${rep.handled}건 처리`
        + (rep.claim ? ` → ${rep.claim.lo}~${rep.claim.hi}번 완료로 기록` : '')
        + (left ? ` · 남은 ${left}건은 다음 수집에서 이어 받아요` : ''));
    }
    scanReport.push(rep);
  }

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
    scans: scanReport,
    detail: detailCfg,
    range: ranged ? { since: opts.since || null, until: opts.until || null } : null,
    dedup,
    counts: { seen: seenAll.length, saved: records.length, skipped, new: newPosts.length, details: detailDone,
              dropped, gone: gone.size, empty: empty.size, excluded: excluded.size },
    http: http.stats, errors, dry: !!opts.dry, source: opts.source || 'cli',
  };

  if (!opts.dry) {
    store.append(records);
    store.saveRun(manifest);
    cov.save();
    store.saveState({
      last_no: Math.max(state.last_no || 0, maxNo),
      last_run: runId, last_run_at: manifest.finished_at,
      runs: (state.runs || 0) + 1, total_posts: store.load().size,
    });
  }
  return { manifest, logs, records: seenAll.length, saved: records.length, skipped, newCount: newPosts.length, detailDone, dropped, excluded: excluded.size, errors };
}
