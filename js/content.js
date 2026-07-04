/* =========================================================================
   CONTENT — editable data layer.
   Base curriculum (window.CURRICULUM_BASE) is read-only seed data.
   Content clones it into a working copy, persists edits to localStorage,
   and recomputes the flattened lesson list on every mutation.
   Every view in app.js reads through Content.get() so Dev Tool edits are
   reflected everywhere immediately.
   ========================================================================= */
(function () {
  const KEY = 'pinbg_curriculum_override_v1';
  let state = null; // { TRACKS, PHASES, ALL_LESSONS }

  function deepClone(x) { return JSON.parse(JSON.stringify(x)); }

  function flatten(TRACKS, PHASES) {
    const ALL_LESSONS = [];
    PHASES.forEach(ph => (ph.weeksList || []).forEach(wk => (wk.lessons || []).forEach(ls => {
      ALL_LESSONS.push({ ...ls, phaseId: ph.id, weekId: wk.id, phaseTitle: ph.title, weekTitle: wk.title, track: ph.track });
    })));
    ALL_LESSONS.forEach((l, i) => { l.uid = `${l.phaseId}__${l.weekId}__${i}`; l.index = i; });
    return ALL_LESSONS;
  }

  function computeDerived() {
    state.ALL_LESSONS = flatten(state.TRACKS, state.PHASES);
  }

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.TRACKS && parsed.PHASES) {
          state = { TRACKS: parsed.TRACKS, PHASES: parsed.PHASES };
          computeDerived();
          return;
        }
      } catch (e) { /* fall through to base */ }
    }
    state = deepClone(window.CURRICULUM_BASE);
    computeDerived();
  }

  function persist() {
    computeDerived();
    try { localStorage.setItem(KEY, JSON.stringify({ TRACKS: state.TRACKS, PHASES: state.PHASES })); } catch (e) { /* quota / unavailable */ }
  }

  function hasOverride() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    load();
  }

  function get() {
    if (!state) load();
    return state;
  }

  function mutate(fn) {
    fn(get());
    persist();
  }

  function exportJSON() {
    return JSON.stringify({ TRACKS: state.TRACKS, PHASES: state.PHASES }, null, 2);
  }

  function importJSON(str) {
    const parsed = JSON.parse(str);
    if (!parsed.TRACKS || !parsed.PHASES) throw new Error('JSON must have TRACKS and PHASES arrays');
    state = { TRACKS: parsed.TRACKS, PHASES: parsed.PHASES };
    persist();
  }

  function slugify(s) {
    return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
  }
  function uniqueId(base, existingIds) {
    let id = slugify(base), n = 2;
    while (existingIds.includes(id)) { id = `${slugify(base)}-${n++}`; }
    return id;
  }

  /* ---------------- Mutation helpers used by the Dev Tool ---------------- */

  function addTrack(data) {
    mutate(s => {
      const id = uniqueId(data.name || 'track', s.TRACKS.map(t => t.id));
      s.TRACKS.push({ id, name: data.name || 'New Track', badge: (data.badge || 'NEW').slice(0, 4).toUpperCase(), blurb: data.blurb || '' });
    });
  }
  function updateTrack(id, patch) { mutate(s => { const t = s.TRACKS.find(t => t.id === id); if (t) Object.assign(t, patch); }); }
  function deleteTrack(id) { mutate(s => { s.TRACKS = s.TRACKS.filter(t => t.id !== id); s.PHASES = s.PHASES.filter(p => p.track !== id); }); }

  function addPhase(trackId) {
    mutate(s => {
      const id = uniqueId('phase-' + trackId, s.PHASES.map(p => p.id));
      const nums = s.PHASES.filter(p => p.track === trackId).map(p => p.num);
      s.PHASES.push({ id, num: nums.length ? Math.max(...nums) + 1 : 0, track: trackId, title: 'New Phase', weeks: '', mega: '', desc: '', weeksList: [] });
    });
  }
  function updatePhase(id, patch) { mutate(s => { const p = s.PHASES.find(p => p.id === id); if (p) Object.assign(p, patch); }); }
  function deletePhase(id) { mutate(s => { s.PHASES = s.PHASES.filter(p => p.id !== id); }); }
  function movePhase(id, dir) {
    mutate(s => {
      const p = s.PHASES.find(p => p.id === id); if (!p) return;
      const siblings = s.PHASES.filter(x => x.track === p.track).sort((a, b) => a.num - b.num);
      const idx = siblings.indexOf(p); const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= siblings.length) return;
      const tmp = siblings[swapIdx].num; siblings[swapIdx].num = p.num; p.num = tmp;
    });
  }

  function addWeek(phaseId) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); if (!ph) return;
      const id = uniqueId(phaseId + '-week', ph.weeksList.map(w => w.id));
      const nums = ph.weeksList.map(w => w.num);
      ph.weeksList.push({ id, num: nums.length ? Math.max(...nums) + 1 : 1, title: 'New Week', lessons: [] });
    });
  }
  function updateWeek(phaseId, weekId, patch) {
    mutate(s => { const ph = s.PHASES.find(p => p.id === phaseId); const w = ph && ph.weeksList.find(w => w.id === weekId); if (w) Object.assign(w, patch); });
  }
  function deleteWeek(phaseId, weekId) {
    mutate(s => { const ph = s.PHASES.find(p => p.id === phaseId); if (ph) ph.weeksList = ph.weeksList.filter(w => w.id !== weekId); });
  }
  function moveWeek(phaseId, weekId, dir) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); if (!ph) return;
      const list = ph.weeksList.sort((a, b) => a.num - b.num);
      const idx = list.findIndex(w => w.id === weekId); const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= list.length) return;
      const tmp = list[swapIdx].num; list[swapIdx].num = list[idx].num; list[idx].num = tmp;
    });
  }

  function addLesson(phaseId, weekId) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); const w = ph && ph.weeksList.find(w => w.id === weekId); if (!w) return;
      w.lessons.push({ day: String(w.lessons.length + 1), title: 'New Lesson', project: '', tags: [], content: [] });
    });
  }
  function updateLesson(phaseId, weekId, lessonIdx, patch) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); const w = ph && ph.weeksList.find(w => w.id === weekId);
      const l = w && w.lessons[lessonIdx]; if (l) Object.assign(l, patch);
    });
  }
  function deleteLesson(phaseId, weekId, lessonIdx) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); const w = ph && ph.weeksList.find(w => w.id === weekId);
      if (w) w.lessons.splice(lessonIdx, 1);
    });
  }
  function moveLesson(phaseId, weekId, lessonIdx, dir) {
    mutate(s => {
      const ph = s.PHASES.find(p => p.id === phaseId); const w = ph && ph.weeksList.find(w => w.id === weekId); if (!w) return;
      const swapIdx = lessonIdx + dir; if (swapIdx < 0 || swapIdx >= w.lessons.length) return;
      const tmp = w.lessons[swapIdx]; w.lessons[swapIdx] = w.lessons[lessonIdx]; w.lessons[lessonIdx] = tmp;
    });
  }

  window.Content = {
    get, mutate, reset, hasOverride, exportJSON, importJSON, flatten,
    addTrack, updateTrack, deleteTrack,
    addPhase, updatePhase, deletePhase, movePhase,
    addWeek, updateWeek, deleteWeek, moveWeek,
    addLesson, updateLesson, deleteLesson, moveLesson,
  };
})();
