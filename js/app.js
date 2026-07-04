/* =========================================================================
   APP — hash router, view rendering, progress tracking (localStorage).
   Reads curriculum data through window.Content so Dev Tool edits reflect
   everywhere immediately.
   ========================================================================= */

const app = document.getElementById('app');

/* ----------------------------- Progress ----------------------------- */
const Progress = {
  key: 'pinbg_progress_v1',
  data: JSON.parse(localStorage.getItem('pinbg_progress_v1') || '{}'),
  save() { localStorage.setItem(this.key, JSON.stringify(this.data)); },
  isDone(uid) { return !!this.data[uid]; },
  toggle(uid) { this.data[uid] = !this.data[uid]; if (!this.data[uid]) delete this.data[uid]; this.save(); },
  set(uid, v) { if (v) this.data[uid] = true; else delete this.data[uid]; this.save(); },
  countDone(lessons) { return lessons.filter(l => this.isDone(l.uid)).length; },
  totalDone() { return Object.keys(this.data).length; },
};

/* ----------------------------- Theme ----------------------------- */
const Theme = {
  init() { const saved = localStorage.getItem('pinbg_theme') || 'dark'; document.documentElement.setAttribute('data-theme', saved); this.updateBtn(saved); },
  toggle() { const cur = document.documentElement.getAttribute('data-theme'); const next = cur === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('pinbg_theme', next); this.updateBtn(next); },
  updateBtn(t) { const b = document.getElementById('themeBtn'); if (b) b.innerHTML = Icon(t === 'dark' ? 'sun' : 'moon', { size: 16 }); },
};

/* ----------------------------- Inline markdown-ish ----------------------------- */
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>');
}

/* ----------------------------- Block renderer ----------------------------- */
function renderBlocks(blocks) {
  const wrap = document.createElement('div');
  wrap.className = 'prose';
  const playgrounds = [];

  (blocks || []).forEach(b => {
    let el;
    switch (b.t) {
      case 'h2': el = h('h2', {}, b.x); break;
      case 'h3': el = h('h3', {}, b.x); break;
      case 'p': el = document.createElement('p'); el.innerHTML = inline(b.x); break;
      case 'ul': case 'ol': {
        el = document.createElement(b.t);
        (b.items || []).forEach(it => { const li = document.createElement('li'); li.innerHTML = inline(it); el.appendChild(li); });
        break;
      }
      case 'obj': {
        el = document.createElement('div'); el.className = 'callout info';
        el.innerHTML = `<div class="ci">${Icon('target', { size: 18 })}</div><div><span class="ci-label">Objectives</span><ul style="margin:6px 0 0 18px">${(b.items || []).map(i => `<li>${inline(i)}</li>`).join('')}</ul></div>`;
        break;
      }
      case 'callout': {
        el = document.createElement('div'); el.className = 'callout ' + b.kind;
        const icon = { tip:'bulb', warn:'alert', info:'info' }[b.kind] || 'info';
        const label = { tip:'Tip', warn:'Warning', info:'Note' }[b.kind] || 'Note';
        el.innerHTML = `<div class="ci">${Icon(icon, { size: 18 })}</div><div><span class="ci-label">${label}</span>${inline(b.x)}</div>`;
        break;
      }
      case 'play': {
        el = document.createElement('div');
        playgrounds.push({ el, code: b.code, title: b.title });
        break;
      }
      case 'quiz': { el = renderQuiz(b); break; }
      case 'apisim': { el = renderApiSim(b); break; }
      default: el = document.createElement('div');
    }
    wrap.appendChild(el);
  });

  requestAnimationFrame(() => playgrounds.forEach(p => createPlayground(p.el, { code: p.code, title: p.title })));
  return wrap;
}

function renderQuiz(b) {
  const el = document.createElement('div'); el.className = 'quiz';
  el.innerHTML = `<div class="q-num">Quick Check</div><h4>${inline(b.q)}</h4>`;
  const explain = h('div', { class: 'explain' });
  let answered = false;
  (b.options || []).forEach((opt, i) => {
    const o = document.createElement('div'); o.className = 'opt';
    o.innerHTML = `<div class="marker">${String.fromCharCode(65+i)}</div><div>${inline(opt)}</div>`;
    o.addEventListener('click', () => {
      if (answered) return; answered = true;
      el.querySelectorAll('.opt').forEach((x, xi) => { if (xi === b.answer) x.classList.add('correct'); });
      if (i !== b.answer) o.classList.add('wrong');
      explain.innerHTML = `<strong>${i === b.answer ? 'Correct.' : 'Not quite.'}</strong> ${inline(b.explain)}`;
      explain.classList.add('show');
    });
    el.appendChild(o);
  });
  el.appendChild(explain);
  return el;
}

function renderApiSim(b) {
  const el = document.createElement('div'); el.className = 'api-sim';
  const statusClass = b.status < 400 ? 'status-2' : 'status-4';
  el.innerHTML = `
    <div class="api-panel">
      <div class="ap-head">Request</div>
      <div class="api-req-line"><span class="method-badge method-${b.method}">${b.method}</span><span style="font-family:var(--font-mono);font-size:13px;color:var(--text-1);align-self:center">${escapeHtml(b.path)}</span></div>
      <pre>${escapeHtml(b.req)}</pre>
    </div>
    <div class="api-panel">
      <div class="ap-head">Response <span class="api-status ${statusClass}">${b.status}</span></div>
      <pre>${escapeHtml(b.res)}</pre>
    </div>`;
  return el;
}

/* ----------------------------- helpers ----------------------------- */
function h(tag, attrs = {}, text) {
  const el = document.createElement(tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text !== undefined) el.textContent = text;
  return el;
}
function nav(path) { location.hash = path; }

/* ----------------------------- Scroll reveal ----------------------------- */
let revealObserver = null;
function wireReveal(root) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  root.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
}

/* =========================================================================
   VIEWS
   ========================================================================= */

function viewHome() {
  const { TRACKS, PHASES, ALL_LESSONS } = Content.get();
  const totalLessons = ALL_LESSONS.length;
  const done = Progress.totalDone();
  const pct = totalLessons ? Math.round(done / totalLessons * 100) : 0;

  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <section class="hero">
      <div class="wrap">
        <div class="hero-badge"><span class="dot"></span> A project-based path -- Python, DSA, Competitive Programming, FastAPI</div>
        <h1>Python is Nothing<br>but a <span class="accent-word">Game</span></h1>
        <p class="lead">Learn Python, Data Structures &amp; Algorithms, Competitive Programming, and FastAPI from absolute basics to production -- with real code you run in your browser, live algorithm visualizers, and a project for every topic.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" onclick="nav('#/track/python')">Start with Python ${Icon('arrowRight',{size:15})}</a>
          <a class="btn btn-ghost" onclick="nav('#/playground')">${Icon('play',{size:15})} Open the Playground</a>
        </div>
        <div class="hero-code">
          <div class="code-head"><span class="cdot"></span><span class="cdot"></span><span class="cdot"></span><span class="fname">welcome.py</span></div>
          <pre><span class="c-kw">for</span> skill <span class="c-kw">in</span> [<span class="c-str">"Python"</span>, <span class="c-str">"DSA"</span>, <span class="c-str">"FastAPI"</span>]:
    <span class="c-kw">print</span>(<span class="c-str">f"You will master {skill}."</span>)

<span class="c-com"># ${totalLessons}+ runnable lessons, live visualizers</span>
<span class="c-com"># real Python, entirely in your browser</span>
<span class="c-kw">print</span>(<span class="c-str">"No install. No setup. Just build."</span>)</pre>
        </div>
        <div class="hero-stats">
          <div class="stat"><div class="num">${totalLessons}+</div><div class="label">Lessons</div></div>
          <div class="stat"><div class="num">6</div><div class="label">Tracks</div></div>
          <div class="stat"><div class="num">4</div><div class="label">Visualizers</div></div>
          <div class="stat"><div class="num">${PHASES.length}</div><div class="label">Phases</div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">Six tracks, one journey</div>
          <h2>Choose where to dive in</h2>
          <p>Everything is project-based and builds on what came before. Start anywhere -- the path is designed to flow.</p>
        </div>
        <div class="grid grid-3 reveal-stagger" id="trackGrid"></div>
      </div>
    </section>

    <section class="section" style="background:var(--bg-1);border-top:1px solid var(--border-soft);border-bottom:1px solid var(--border-soft)">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">Why it works</div>
          <h2>Built for how people actually learn</h2>
        </div>
        <div class="grid grid-3 reveal-stagger">
          <div class="card"><div class="ic">${Icon('play',{size:20})}</div><h3>Run real Python</h3><p>Every example is a live editor powered by Pyodide (Python compiled to WebAssembly). Edit, run, break things -- no install, ever.</p></div>
          <div class="card"><div class="ic">${Icon('graph',{size:20})}</div><h3>See algorithms move</h3><p>Watch sorting, binary search, graph traversal and tree walks animate step by step. Abstract ideas become obvious.</p></div>
          <div class="card"><div class="ic">${Icon('code',{size:20})}</div><h3>Project per topic</h3><p>From a tip splitter to a deployed Task Manager API -- you build something real at every step.</p></div>
          <div class="card"><div class="ic">${Icon('layers',{size:20})}</div><h3>Progress that sticks</h3><p>Tick off lessons; your progress is saved locally and shown per phase. Momentum you can see.</p></div>
          <div class="card"><div class="ic">${Icon('settings',{size:20})}</div><h3>Dev Tool included</h3><p>Every track, phase, week and lesson is editable live from the Dev Tool -- extend the curriculum without touching code.</p></div>
          <div class="card"><div class="ic">${Icon('trophy',{size:20})}</div><h3>Job-ready finish</h3><p>End with a tested, Dockerised, CI/CD-deployed API and a portfolio recruiters actually read.</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="eyebrow">The full arc</div>
          <h2>Your phase-by-phase roadmap</h2>
          <p>Every phase ends in a milestone or mega project. Click any phase to jump in.</p>
        </div>
        ${done > 0 ? `<div class="progress-ring-wrap reveal" style="max-width:520px;margin:0 auto 40px">${Icon('flag',{size:20})}<div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;font-family:var(--font-mono)"><span>Overall progress</span><span><b style="color:var(--text-0)">${done}</b> / ${totalLessons} lessons</span></div><div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%"></div></div></div><div style="font-weight:800;font-size:18px;color:var(--text-0);font-family:var(--font-mono)">${pct}%</div></div>` : ''}
        <div class="timeline" id="timeline"></div>
      </div>
    </section>

    ${renderFooterHTML()}
  `;

  const grid = el.querySelector('#trackGrid');
  TRACKS.forEach(t => {
    const trackPhases = PHASES.filter(p => p.track === t.id);
    const totalT = ALL_LESSONS.filter(l => l.track === t.id).length;
    const isEmpty = totalT === 0 && trackPhases.some(p => p.weeksList.length === 0);
    const c = h('div', { class: 'card track-card' + (isEmpty ? ' empty-track' : '') });
    c.innerHTML = `
      <div class="accent-bar"></div>
      <div class="badge-tag">${escapeHtml(t.badge)}</div>
      <h3>${escapeHtml(t.name)}${isEmpty ? '<span class="status-chip">in progress</span>' : ''}</h3>
      <p>${escapeHtml(t.blurb)}</p>
      <div class="track-meta"><span><b>${trackPhases.length}</b> phase${trackPhases.length===1?'':'s'}</span><span><b>${totalT}</b> lessons</span></div>
      <div class="arrow">${Icon('arrowRight',{size:16})}</div>`;
    c.addEventListener('click', () => nav('#/track/' + t.id));
    grid.appendChild(c);
  });

  const tl = el.querySelector('#timeline');
  PHASES.forEach(ph => {
    const item = h('div', { class: 'tl-item reveal' });
    const lessons = ALL_LESSONS.filter(l => l.phaseId === ph.id);
    const doneCount = Progress.countDone(lessons);
    const isEmpty = ph.weeksList.length === 0;
    item.innerHTML = `
      <div class="tl-node"></div>
      <div class="tl-card">
        <div class="tl-phase">Phase ${ph.num} -- ${escapeHtml((TRACKS.find(t=>t.id===ph.track)||{}).badge || ph.track)}</div>
        <h4>${escapeHtml(ph.title)}</h4>
        <div class="wk">${escapeHtml(ph.weeks || '')} ${isEmpty ? '-- not yet authored' : `-- ${doneCount}/${lessons.length} done`}</div>
        ${ph.mega ? `<div class="proj">Mega project: <b>${escapeHtml(ph.mega)}</b></div>` : ''}
      </div>`;
    item.querySelector('.tl-card').addEventListener('click', () => nav('#/track/' + ph.track + '?phase=' + ph.id));
    tl.appendChild(item);
  });

  requestAnimationFrame(() => wireReveal(el));
  return el;
}

function viewTrack(trackId, focusPhase) {
  const { TRACKS, PHASES, ALL_LESSONS } = Content.get();
  const track = TRACKS.find(t => t.id === trackId);
  if (!track) return viewNotFound();
  const phases = PHASES.filter(p => p.track === trackId).sort((a, b) => a.num - b.num);
  const lessons = ALL_LESSONS.filter(l => l.track === trackId);
  const done = Progress.countDone(lessons);
  const pct = lessons.length ? Math.round(done / lessons.length * 100) : 0;

  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <div class="wrap">
      <div class="track-hero">
        <div class="breadcrumb"><a onclick="nav('#/')">Home</a> ${Icon('chevronRight',{size:12})} ${escapeHtml(track.name)}</div>
        <h1><span class="track-ic">${escapeHtml(track.badge)}</span> ${escapeHtml(track.name)}</h1>
        <p>${escapeHtml(track.blurb)}</p>
        ${lessons.length ? `<div class="progress-ring-wrap">
          <div style="font-weight:800;font-size:20px;color:var(--text-0);font-family:var(--font-mono)">${pct}%</div>
          <div style="flex:1"><div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%"></div></div></div>
          <div style="font-size:12.5px;color:var(--text-3);font-family:var(--font-mono)">${done}/${lessons.length} lessons</div>
        </div>` : ''}
      </div>
      <div id="phaseHost"></div>
    </div>
    ${renderFooterHTML()}
  `;

  const host = el.querySelector('#phaseHost');
  phases.forEach(ph => {
    const isEmpty = ph.weeksList.length === 0;
    const block = h('div', { class: 'phase-block' + (isEmpty ? ' empty-phase' : '') });
    block.innerHTML = `
      <div class="phase-title"><span class="phase-num">${String(ph.num).padStart(2,'0')}</span> ${escapeHtml(ph.title)}</div>
      <div class="phase-sub">${escapeHtml(ph.weeks || '')}${ph.mega ? ` -- Mega project: ${escapeHtml(ph.mega)}` : ''}${ph.desc ? ` -- ${escapeHtml(ph.desc)}` : ''}</div>
    `;

    if (isEmpty) {
      const note = h('div', { class: 'phase-empty-note' });
      note.innerHTML = `${Icon('folder',{size:18})}<div>This phase has no lessons yet.${ph.milestone ? ` <strong>Milestone:</strong> ${escapeHtml(ph.milestone)}` : ''} Add lessons any time with the <span class="devtool-link">Dev Tool</span>.</div>`;
      note.querySelector('.devtool-link').addEventListener('click', () => nav('#/devtool?phase=' + ph.id));
      block.appendChild(note);
      if (ph.outline && ph.outline.length) {
        const outline = h('details', { class: 'phase-outline' });
        outline.innerHTML = `<summary>Reference outline (${ph.outline.length} topic groups) -- use this while authoring</summary><ul>${ph.outline.map(o => `<li>${inline(o)}</li>`).join('')}</ul>`;
        block.appendChild(outline);
      }
    }

    ph.weeksList.forEach(wk => {
      const doneW = Progress.countDone(wk.lessons.map(l => ({ uid: findUid(ALL_LESSONS, ph, wk, l) })));
      const wc = h('div', { class: 'week-card' });
      const shouldOpen = focusPhase === ph.id;
      if (shouldOpen) wc.classList.add('open');
      wc.innerHTML = `
        <div class="week-head">
          <span class="wk-badge">Week ${wk.num}</span>
          <h4>${escapeHtml(wk.title)}</h4>
          <span class="wk-prog">${doneW}/${wk.lessons.length}</span>
          <span class="chev">${Icon('chevronDown',{size:16})}</span>
        </div>
        <div class="week-body"><div class="week-body-inner"></div></div>`;
      const inner = wc.querySelector('.week-body-inner');
      wk.lessons.forEach(ls => {
        const uid = findUid(ALL_LESSONS, ph, wk, ls);
        const row = h('div', { class: 'lesson-row' });
        const isDone = Progress.isDone(uid);
        row.innerHTML = `
          <div class="lesson-check ${isDone ? 'done' : ''}" data-uid="${uid}">${Icon('check',{size:13})}</div>
          <span class="day-num">Day ${escapeHtml(String(ls.day))}</span>
          <div class="l-title"><div class="lt">${escapeHtml(ls.title)}</div>${ls.project ? `<div class="lp">Project: <b>${escapeHtml(ls.project)}</b></div>` : ''}</div>
          ${(ls.tags || []).slice(0,1).map(t => `<span class="l-tag">${escapeHtml(t)}</span>`).join('')}`;
        row.querySelector('.lesson-check').addEventListener('click', (e) => {
          e.stopPropagation();
          Progress.toggle(uid);
          e.currentTarget.classList.toggle('done');
          updateWeekProgress(wc, wk, ph, ALL_LESSONS);
        });
        row.addEventListener('click', () => nav('#/lesson/' + uid));
        inner.appendChild(row);
      });
      wc.querySelector('.week-head').addEventListener('click', () => wc.classList.toggle('open'));
      block.appendChild(wc);
    });
    host.appendChild(block);
  });

  if (focusPhase) requestAnimationFrame(() => { const opened = el.querySelector('.week-card.open') || el.querySelector('.empty-phase'); if (opened) opened.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  return el;
}

function findUid(ALL_LESSONS, ph, wk, ls) {
  const found = ALL_LESSONS.find(l => l.phaseId === ph.id && l.weekId === wk.id && l.day === ls.day && l.title === ls.title);
  return found ? found.uid : '';
}
function updateWeekProgress(wc, wk, ph, ALL_LESSONS) {
  const doneW = wk.lessons.filter(l => Progress.isDone(findUid(ALL_LESSONS, ph, wk, l))).length;
  wc.querySelector('.wk-prog').textContent = `${doneW}/${wk.lessons.length}`;
}

function viewLesson(uid) {
  const { ALL_LESSONS, TRACKS, PHASES } = Content.get();
  const lesson = ALL_LESSONS.find(l => l.uid === uid);
  if (!lesson) return viewNotFound();
  const idx = lesson.index;
  const prev = ALL_LESSONS[idx - 1], next = ALL_LESSONS[idx + 1];
  const ph = PHASES.find(p => p.id === lesson.phaseId);
  const track = TRACKS.find(t => t.id === ph.track);
  const isDone = Progress.isDone(uid);

  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <div class="wrap wrap-narrow">
      <div class="lesson-header">
        <div class="l-crumb"><a onclick="nav('#/')">Home</a> / <a onclick="nav('#/track/${track.id}')">${escapeHtml(track.name)}</a> / ${escapeHtml(lesson.weekTitle)}</div>
        <h1>${escapeHtml(lesson.title)}</h1>
        <div class="l-meta">
          <span class="pill">Day ${escapeHtml(String(lesson.day))}</span>
          <span class="pill">Phase ${ph.num}</span>
          ${lesson.project ? `<span class="pill">Project: ${escapeHtml(lesson.project)}</span>` : ''}
          <span class="pill lesson-done-toggle" style="cursor:pointer">${isDone ? Icon('check',{size:13}) + ' Completed' : 'Mark complete'}</span>
        </div>
      </div>
      <div id="lessonBody"></div>
      <div class="lesson-nav">
        <div class="ln-btn prev ${prev ? '' : 'disabled'}">${prev ? `<div class="dir">Previous</div><div class="ttl">${escapeHtml(prev.title)}</div>` : ''}</div>
        <div class="ln-btn next ${next ? '' : 'disabled'}">${next ? `<div class="dir">Next</div><div class="ttl">${escapeHtml(next.title)}</div>` : ''}</div>
      </div>
    </div>
    ${renderFooterHTML()}
  `;

  const body = el.querySelector('#lessonBody');
  body.appendChild(renderBlocks(lesson.content && lesson.content.length ? lesson.content : [{ t:'p', x:'Content coming soon -- add it with the Dev Tool.' }]));

  const toggle = el.querySelector('.lesson-done-toggle');
  toggle.addEventListener('click', () => {
    Progress.toggle(uid);
    const nowDone = Progress.isDone(uid);
    toggle.innerHTML = nowDone ? Icon('check',{size:13}) + ' Completed' : 'Mark complete';
  });

  if (prev) el.querySelector('.ln-btn.prev').addEventListener('click', () => nav('#/lesson/' + prev.uid));
  if (next) el.querySelector('.ln-btn.next').addEventListener('click', () => { if (!isDone) Progress.set(uid, true); nav('#/lesson/' + next.uid); });

  window.scrollTo(0, 0);
  return el;
}

/* --------- Playground page --------- */
const PG_SNIPPETS = {
  'Basics': [
    { name: 'Hello and f-strings', code: `name = "Prach"\nlangs = ["Python", "DSA", "FastAPI"]\nprint(f"Hi {name}! Today you conquer:")\nfor i, l in enumerate(langs, 1):\n    print(f"  {i}. {l}")` },
    { name: 'FizzBuzz', code: `for n in range(1, 21):\n    out = ""\n    if n % 3 == 0: out += "Fizz"\n    if n % 5 == 0: out += "Buzz"\n    print(out or n)` },
    { name: 'List comprehension', code: `nums = range(1, 11)\nsquares = [n*n for n in nums]\nevens = [n for n in nums if n % 2 == 0]\nprint("squares:", squares)\nprint("evens:  ", evens)` },
  ],
  'OOP': [
    { name: 'Dataclass', code: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n    def dist(self):\n        return (self.x**2 + self.y**2) ** 0.5\n\np = Point(3, 4)\nprint(p, "distance:", p.dist())` },
    { name: 'Decorator', code: `import functools, time\n\ndef timer(fn):\n    @functools.wraps(fn)\n    def wrap(*a, **k):\n        t = time.perf_counter()\n        r = fn(*a, **k)\n        print(f"{fn.__name__}: {time.perf_counter()-t:.5f}s")\n        return r\n    return wrap\n\n@timer\ndef work(n): return sum(range(n))\nwork(500000)` },
  ],
  'DSA': [
    { name: 'Binary search', code: `def bsearch(a, x):\n    lo, hi = 0, len(a)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if a[mid] == x: return mid\n        if a[mid] < x: lo = mid+1\n        else: hi = mid-1\n    return -1\n\nprint(bsearch([1,3,5,7,9,11,13], 9))` },
    { name: 'Fibonacci (cached)', code: `from functools import lru_cache\n\n@lru_cache(None)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)\n\nprint([fib(n) for n in range(15)])` },
    { name: 'Quick sort', code: `def qsort(a):\n    if len(a) <= 1: return a\n    pivot = a[len(a)//2]\n    lt = [x for x in a if x < pivot]\n    eq = [x for x in a if x == pivot]\n    gt = [x for x in a if x > pivot]\n    return qsort(lt) + eq + qsort(gt)\n\nprint(qsort([5,2,9,1,7,3,8]))` },
  ],
  'Competitive Programming': [
    { name: 'Floor division with negatives', code: `print(-7 // 2, -7 % 2)\nprint(divmod(-7, 2))\nprint(pow(3, 5, 7))` },
    { name: 'Fast input simulation', code: `import sys, io\nsys.stdin = io.StringIO("3\\n1 2\\n3 4\\n5 6\\n")\nt = int(input())\nfor _ in range(t):\n    a, b = map(int, input().split())\n    print(a + b)` },
    { name: 'Sieve of Eratosthenes', code: `def sieve(n):\n    is_p = [True]*(n+1); is_p[0]=is_p[1]=False\n    for i in range(2, int(n**0.5)+1):\n        if is_p[i]:\n            for j in range(i*i, n+1, i): is_p[j]=False\n    return [i for i,p in enumerate(is_p) if p]\nprint(sieve(50))` },
  ],
};

function viewPlayground() {
  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <div class="playground-page">
      <aside class="pg-sidebar">
        <h3 style="margin-top:4px">Snippets</h3>
        <div id="snips"></div>
        <h3>Tips</h3>
        <div style="font-size:12.5px;color:var(--text-2);padding:0 8px;line-height:1.6">
          <p style="margin-bottom:10px">Press <code style="background:var(--bg-3);padding:1px 5px;border-radius:4px">Ctrl/Cmd + Enter</code> to run.</p>
          <p>This is real Python running in your browser via Pyodide. Import <code style="background:var(--bg-3);padding:1px 5px;border-radius:4px">math</code>, <code style="background:var(--bg-3);padding:1px 5px;border-radius:4px">random</code>, <code style="background:var(--bg-3);padding:1px 5px;border-radius:4px">json</code>, <code style="background:var(--bg-3);padding:1px 5px;border-radius:4px">collections</code> and more.</p>
        </div>
      </aside>
      <main class="pg-main" id="pgMain"></main>
    </div>`;

  const pgHost = el.querySelector('#pgMain');
  const pg = createPlayground(pgHost, { code: PG_SNIPPETS.Basics[0].code, title: 'playground.py', full: true });

  const snips = el.querySelector('#snips');
  Object.entries(PG_SNIPPETS).forEach(([cat, items]) => {
    const h3 = h('h3', {}, cat); h3.style.marginLeft = '8px'; snips.appendChild(h3);
    items.forEach(s => {
      const d = h('div', { class: 'pg-snippet' });
      d.innerHTML = `${Icon('file',{size:13})} ${escapeHtml(s.name)}`;
      d.addEventListener('click', () => pg.setCode(s.code));
      snips.appendChild(d);
    });
  });
  return el;
}

/* --------- Visualizer page --------- */
function viewVisualizer(which) {
  const tabs = [
    { id: 'sorting', name: 'Sorting', ic:'grid', fn: Viz.sorting, desc: 'Watch five sorting algorithms compare, swap and settle. Tune size and speed.' },
    { id: 'searching', name: 'Searching', ic:'target', fn: Viz.searching, desc: 'Binary search halving the range in O(log n) -- see lo, mid, hi move.' },
    { id: 'graph', name: 'Graph', ic:'graph', fn: Viz.graph, desc: 'BFS vs DFS flooding a graph from node A. Frontier vs visited, live.' },
    { id: 'tree', name: 'Binary Tree', ic:'tree', fn: Viz.tree, desc: 'In/pre/post/level-order traversal of a binary search tree.' },
  ];
  const active = tabs.find(t => t.id === which) || tabs[0];

  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <div class="wrap">
      <div class="track-hero" style="padding-bottom:10px">
        <div class="breadcrumb"><a onclick="nav('#/')">Home</a> ${Icon('chevronRight',{size:12})} Visualizers</div>
        <h1><span class="track-ic">${Icon('graph',{size:24})}</span> Algorithm Visualizers</h1>
        <p id="vizDesc">${active.desc}</p>
      </div>
      <div class="chip-row" id="vizTabs"></div>
      <div class="viz-page" id="vizStage"></div>
    </div>
    ${renderFooterHTML()}`;

  const tabRow = el.querySelector('#vizTabs');
  const stage = el.querySelector('#vizStage');
  const descEl = el.querySelector('#vizDesc');
  let controller = null;

  function mount(tab) {
    if (controller && controller.destroy) controller.destroy();
    stage.innerHTML = '';
    descEl.textContent = tab.desc;
    controller = tab.fn(stage);
    tabRow.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.id === tab.id));
    history.replaceState(null, '', '#/visualizer/' + tab.id);
  }
  tabs.forEach(t => {
    const chip = h('div', { class: 'chip' + (t.id === active.id ? ' active' : '') });
    chip.innerHTML = `${Icon(t.ic,{size:14})} ${t.name}`;
    chip.dataset.id = t.id;
    chip.addEventListener('click', () => mount(t));
    tabRow.appendChild(chip);
  });
  requestAnimationFrame(() => mount(active));
  return el;
}

/* --------- API Lab (FastAPI simulator) --------- */
const API_ROUTES = [
  { method: 'GET', path: '/tasks', desc: 'List all tasks', body: null,
    handle: () => ({ status: 200, res: JSON.stringify([{ id: 1, title: 'Learn FastAPI', done: false }, { id: 2, title: 'Ship API', done: false }], null, 2) }) },
  { method: 'GET', path: '/tasks/1', desc: 'Get one task', body: null,
    handle: () => ({ status: 200, res: JSON.stringify({ id: 1, title: 'Learn FastAPI', done: false }, null, 2) }) },
  { method: 'GET', path: '/tasks/999', desc: 'Missing task, returns 404', body: null,
    handle: () => ({ status: 404, res: JSON.stringify({ detail: 'Task 999 not found' }, null, 2) }) },
  { method: 'POST', path: '/tasks', desc: 'Create a task', body: '{\n  "title": "Deploy to Railway",\n  "done": false\n}',
    handle: (body) => { try { const d = JSON.parse(body); if (!d.title) return { status: 422, res: JSON.stringify({ detail: [{ loc: ['body', 'title'], msg: 'field required' }] }, null, 2) }; return { status: 201, res: JSON.stringify({ id: 3, ...d }, null, 2) }; } catch { return { status: 422, res: JSON.stringify({ detail: 'Invalid JSON body' }, null, 2) }; } } },
  { method: 'PUT', path: '/tasks/1', desc: 'Mark task done', body: '{\n  "title": "Learn FastAPI",\n  "done": true\n}',
    handle: (body) => { try { const d = JSON.parse(body); return { status: 200, res: JSON.stringify({ id: 1, ...d }, null, 2) }; } catch { return { status: 422, res: JSON.stringify({ detail: 'Invalid JSON body' }, null, 2) }; } } },
  { method: 'DELETE', path: '/tasks/2', desc: 'Delete a task', body: null,
    handle: () => ({ status: 204, res: '(no content)' }) },
];

function viewApiLab() {
  const el = h('div', { class: 'view' });
  el.innerHTML = `
    <div class="wrap wrap-narrow">
      <div class="track-hero" style="padding-bottom:14px">
        <div class="breadcrumb"><a onclick="nav('#/')">Home</a> ${Icon('chevronRight',{size:12})} API Lab</div>
        <h1><span class="track-ic">${Icon('server',{size:22})}</span> FastAPI Lab</h1>
        <p>A live REST API simulator. Pick an endpoint, edit the request body, and see exactly what FastAPI would return -- status codes, validation errors and all.</p>
      </div>
      <div class="chip-row" id="routeChips"></div>
      <div class="api-panel" style="margin-bottom:18px">
        <div class="ap-head">Request</div>
        <div class="api-req-line">
          <span class="method-badge" id="reqMethod">GET</span>
          <span id="reqPath" style="font-family:var(--font-mono);font-size:14px;color:var(--text-1);align-self:center">/tasks</span>
          <span style="flex:1"></span>
          <button class="pg-run" id="sendBtn">${Icon('play',{size:13})} Send</button>
        </div>
        <div id="bodyWrap" style="border-top:1px solid var(--border)">
          <div class="out-head" style="padding:8px 16px">Request body (JSON)</div>
          <textarea id="reqBody" spellcheck="false" style="width:100%;min-height:120px;background:var(--bg-0);color:var(--text-0);border:none;padding:14px;font-family:var(--font-mono);font-size:13px;resize:vertical;outline:none"></textarea>
        </div>
      </div>
      <div class="api-panel">
        <div class="ap-head">Response <span class="api-status" id="resStatus" style="visibility:hidden">200</span></div>
        <pre id="resBody" style="color:var(--text-3)">Press Send to call the endpoint.</pre>
      </div>
      <div class="callout info" style="margin-top:26px"><div class="ci">${Icon('info',{size:18})}</div><div><span class="ci-label">Note</span>In real FastAPI, each of these is a decorated function. A <code>GET /tasks/{id}</code> that can't find the id raises <code>HTTPException(404)</code>; a bad request body fails Pydantic validation and auto-returns <code>422</code> -- none of which you write by hand.</div></div>
    </div>
    ${renderFooterHTML()}`;

  let current = API_ROUTES[0];
  const chips = el.querySelector('#routeChips');
  const reqMethod = el.querySelector('#reqMethod'), reqPath = el.querySelector('#reqPath');
  const bodyWrap = el.querySelector('#bodyWrap'), reqBody = el.querySelector('#reqBody');
  const resStatus = el.querySelector('#resStatus'), resBody = el.querySelector('#resBody');

  function select(route) {
    current = route;
    reqMethod.textContent = route.method;
    reqMethod.className = 'method-badge method-' + route.method;
    reqPath.textContent = route.path;
    bodyWrap.style.display = route.body !== null ? 'block' : 'none';
    if (route.body !== null) reqBody.value = route.body;
    resBody.textContent = 'Press Send to call the endpoint.'; resBody.style.color = 'var(--text-3)';
    resStatus.style.visibility = 'hidden';
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.k === route.method + route.path));
  }
  API_ROUTES.forEach(r => {
    const chip = h('div', { class: 'chip' }, `${r.method} ${r.path}`);
    chip.dataset.k = r.method + r.path;
    chip.title = r.desc;
    chip.addEventListener('click', () => select(r));
    chips.appendChild(chip);
  });

  el.querySelector('#sendBtn').addEventListener('click', () => {
    const result = current.handle(reqBody.value);
    resStatus.style.visibility = 'visible';
    resStatus.textContent = result.status;
    resStatus.className = 'api-status ' + (result.status < 400 ? 'status-2' : 'status-4');
    resBody.textContent = result.res;
    resBody.style.color = 'var(--text-1)';
  });

  select(API_ROUTES[0]);
  return el;
}

function viewNotFound() {
  const el = h('div', { class: 'view' });
  el.innerHTML = `<div class="wrap"><div class="empty-state">${Icon('terminal',{size:44})}<h2>Page not found</h2><p style="margin:12px 0 24px">That route does not exist.</p><a class="btn btn-primary" onclick="nav('#/')">Back home</a></div></div>`;
  return el;
}

/* ----------------------------- Footer ----------------------------- */
function renderFooterHTML() {
  return `
  <footer><div class="wrap"><div class="f-grid">
    <div class="f-brand">
      <div class="brand"><div class="logo">${Icon('terminal',{size:17})}</div><div><div class="name">Python is <b>a Game</b></div></div></div>
      <p>A free, open, project-based path from your first <code>print()</code> to a deployed API. Learn by building.</p>
    </div>
    <div class="f-col"><h5>Tracks</h5>
      <a onclick="nav('#/track/python')">Python</a>
      <a onclick="nav('#/track/dsa')">DSA</a>
      <a onclick="nav('#/track/cp')">Competitive Programming</a>
      <a onclick="nav('#/track/fastapi')">FastAPI</a>
    </div>
    <div class="f-col"><h5>Interactive</h5>
      <a onclick="nav('#/playground')">Playground</a>
      <a onclick="nav('#/visualizer/sorting')">Visualizers</a>
      <a onclick="nav('#/apilab')">API Lab</a>
      <a onclick="nav('#/devtool')">Dev Tool</a>
    </div>
    <div class="f-col"><h5>Resources</h5>
      <a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python Docs</a>
      <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener">FastAPI Docs</a>
      <a href="https://roadmap.sh/datastructures-and-algorithms" target="_blank" rel="noopener">roadmap.sh DSA</a>
      <a href="https://codeforces.com/" target="_blank" rel="noopener">Codeforces</a>
    </div>
  </div>
  <div class="f-bottom">Built with WebAssembly Python -- progress saved in your browser -- Python is Nothing but a Game</div>
  </div></footer>`;
}

/* ----------------------------- Router ----------------------------- */
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query = {};
  if (queryPart) queryPart.split('&').forEach(kv => { const [k, v] = kv.split('='); query[k] = decodeURIComponent(v || ''); });
  return { parts, query };
}

function route() {
  const { parts, query } = parseHash();
  let view;
  const [a, b] = parts;
  if (!a || a === 'home') view = viewHome();
  else if (a === 'track') view = viewTrack(b, query.phase);
  else if (a === 'lesson') view = viewLesson(b);
  else if (a === 'playground') view = viewPlayground();
  else if (a === 'visualizer') view = viewVisualizer(b);
  else if (a === 'apilab') view = viewApiLab();
  else if (a === 'devtool') view = DevTool.render(query);
  else view = viewNotFound();

  app.innerHTML = '';
  app.appendChild(view);
  updateNavActive(a || 'home');
  if (a !== 'visualizer' && a !== 'playground' && a !== 'devtool') window.scrollTo(0, 0);
  closeMobileMenu();
}

function updateNavActive(section) {
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });
}

/* ----------------------------- Mobile menu ----------------------------- */
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobileMenu() { const m = document.getElementById('mobileMenu'); if (m) m.classList.remove('open'); }

/* ----------------------------- Boot ----------------------------- */
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  paintChrome();
  route();
  setTimeout(() => Py.warm(), 1500);
});

function paintChrome() {
  const hb = document.getElementById('hamburgerBtn'); if (hb) hb.innerHTML = Icon('menu', { size: 18 });
  const logo = document.getElementById('brandLogo'); if (logo) logo.innerHTML = Icon('terminal', { size: 18 });
}

window.nav = nav;
window.toggleMobileMenu = toggleMobileMenu;
window.Theme = Theme;
window.Progress = Progress;
window.renderBlocks = renderBlocks;
window.escapeHtmlSafe = escapeHtml;
