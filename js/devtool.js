/* =========================================================================
   DEV TOOL — in-browser CMS for the curriculum.
   Browse Tracks -> Phases -> Weeks -> Lessons in a tree, edit everything
   in a form panel on the right, including per-block lesson content.
   All edits persist to localStorage via Content and are picked up by
   every other view immediately (each view reads Content.get() fresh).
   ========================================================================= */
const DevTool = (() => {
  let rootEl = null;
  let mainEl = null;
  let treeEl = null;
  let selected = null; // {kind:'track'|'phase'|'week'|'lesson', trackId, phaseId, weekId, lessonIdx}
  const expanded = new Set();

  const BLOCK_TYPES = [
    { t:'h2', label:'Heading (large)' },
    { t:'h3', label:'Heading (small)' },
    { t:'p', label:'Paragraph' },
    { t:'ul', label:'Bullet list' },
    { t:'ol', label:'Numbered list' },
    { t:'callout', label:'Callout' },
    { t:'play', label:'Runnable code' },
    { t:'quiz', label:'Quiz question' },
    { t:'obj', label:'Objectives banner' },
    { t:'apisim', label:'API request/response' },
  ];
  function blankBlock(t) {
    switch (t) {
      case 'h2': case 'h3': return { t, x:'New heading' };
      case 'p': return { t, x:'New paragraph.' };
      case 'ul': case 'ol': return { t, items:['First point'] };
      case 'callout': return { t, kind:'info', x:'Note text.' };
      case 'play': return { t, code:'print("hello")', title:'main.py' };
      case 'quiz': return { t, q:'Question?', options:['A','B'], answer:0, explain:'Because...' };
      case 'obj': return { t, items:['Learning goal'] };
      case 'apisim': return { t, method:'GET', path:'/example', req:'GET /example HTTP/1.1', status:200, res:'{}' };
      default: return { t:'p', x:'' };
    }
  }

  function toast(msg) {
    document.querySelectorAll('.dt-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'dt-toast';
    t.innerHTML = `${Icon('check',{size:15})} ${escapeHtml(msg)}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function confirmModal(title, msg, onConfirm) {
    const backdrop = document.createElement('div'); backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal">
      <h3>${escapeHtml(title)}</h3><p>${escapeHtml(msg)}</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="mCancel">Cancel</button>
        <button class="btn btn-danger" id="mOk">Confirm</button>
      </div></div>`;
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
    backdrop.querySelector('#mCancel').addEventListener('click', () => backdrop.remove());
    backdrop.querySelector('#mOk').addEventListener('click', () => { backdrop.remove(); onConfirm(); });
    document.body.appendChild(backdrop);
  }

  function render(query) {
    selected = null;
    const el = document.createElement('div'); el.className = 'view';
    el.innerHTML = `<div class="devtool-page">
      <aside class="dt-sidebar">
        <div class="dt-sidebar-head">
          <h3>${Icon('settings',{size:16})} Dev Tool</h3>
          <p>Edit every track, phase, week and lesson. Changes autosave to this browser and apply everywhere instantly.</p>
        </div>
        <div class="dt-toolbar">
          <button class="btn btn-sm btn-ghost" id="dtExport">${Icon('download',{size:13})} Export</button>
          <button class="btn btn-sm btn-ghost" id="dtImport">${Icon('upload',{size:13})} Import</button>
          <button class="btn btn-sm btn-outline" id="dtReset">${Icon('refresh',{size:13})} Reset</button>
          <input type="file" id="dtImportFile" accept="application/json" style="display:none">
        </div>
        <div class="dt-tree" id="dtTree"></div>
      </aside>
      <div class="dt-main" id="dtMain"></div>
    </div>`;
    rootEl = el; treeEl = el.querySelector('#dtTree'); mainEl = el.querySelector('#dtMain');

    el.querySelector('#dtExport').addEventListener('click', doExport);
    el.querySelector('#dtImport').addEventListener('click', () => el.querySelector('#dtImportFile').click());
    el.querySelector('#dtImportFile').addEventListener('change', doImport);
    el.querySelector('#dtReset').addEventListener('click', () => confirmModal('Reset to default?', 'This discards every edit you have made in the Dev Tool and restores the built-in curriculum. This cannot be undone.', () => { Content.reset(); toast('Reset to default curriculum'); selected = null; buildTree(); buildMain(); }));

    if (query && query.phase) {
      const { PHASES } = Content.get();
      const ph = PHASES.find(p => p.id === query.phase);
      if (ph) { expanded.add(ph.track); expanded.add(ph.id); selected = { kind:'phase', trackId: ph.track, phaseId: ph.id }; }
    }

    buildTree();
    buildMain();
    return el;
  }

  function doExport() {
    const blob = new Blob([Content.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'curriculum-export.json'; a.click();
    URL.revokeObjectURL(url);
    toast('Exported curriculum-export.json');
  }
  function doImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { Content.importJSON(reader.result); toast('Imported successfully'); selected = null; buildTree(); buildMain(); }
      catch (err) { toast('Import failed: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function select(sel) { selected = sel; buildTree(); buildMain(); }

  /* ---------------------------- TREE ---------------------------- */
  function buildTree() {
    const { TRACKS, PHASES } = Content.get();
    treeEl.innerHTML = '';
    TRACKS.forEach(track => {
      const trackPhases = PHASES.filter(p => p.track === track.id).sort((a,b) => a.num - b.num);
      const node = document.createElement('div'); node.className = 'dt-node';
      const isOpen = expanded.has(track.id);
      const row = document.createElement('div');
      row.className = 'dt-node-row' + (selected && selected.kind === 'track' && selected.trackId === track.id ? ' selected' : '');
      row.innerHTML = `<span class="dt-chev ${isOpen?'open':''}">${Icon('chevronRight',{size:13})}</span><span class="dt-label">${escapeHtml(track.name)}</span><span class="dt-count">${trackPhases.length}</span>`;
      row.addEventListener('click', () => { if (expanded.has(track.id)) expanded.delete(track.id); else expanded.add(track.id); select({ kind:'track', trackId: track.id }); });
      node.appendChild(row);

      if (isOpen) {
        const children = document.createElement('div'); children.className = 'dt-children';
        trackPhases.forEach(ph => {
          const phOpen = expanded.has(ph.id);
          const phRow = document.createElement('div');
          phRow.className = 'dt-node-row' + (selected && selected.kind === 'phase' && selected.phaseId === ph.id ? ' selected' : '');
          phRow.innerHTML = `<span class="dt-chev ${phOpen?'open':''}">${Icon('chevronRight',{size:13})}</span><span class="dt-label">P${ph.num} -- ${escapeHtml(ph.title)}</span><span class="dt-count">${ph.weeksList.length}</span>`;
          phRow.addEventListener('click', (e) => { e.stopPropagation(); if (expanded.has(ph.id)) expanded.delete(ph.id); else expanded.add(ph.id); select({ kind:'phase', trackId: track.id, phaseId: ph.id }); });
          children.appendChild(phRow);

          if (phOpen) {
            const wkWrap = document.createElement('div'); wkWrap.className = 'dt-children';
            ph.weeksList.forEach(wk => {
              const wkOpen = expanded.has(wk.id);
              const wkRow = document.createElement('div');
              wkRow.className = 'dt-node-row' + (selected && selected.kind === 'week' && selected.weekId === wk.id ? ' selected' : '');
              wkRow.innerHTML = `<span class="dt-chev ${wkOpen?'open':''}">${Icon('chevronRight',{size:13})}</span><span class="dt-label">W${wk.num} -- ${escapeHtml(wk.title)}</span><span class="dt-count">${wk.lessons.length}</span>`;
              wkRow.addEventListener('click', (e) => { e.stopPropagation(); if (expanded.has(wk.id)) expanded.delete(wk.id); else expanded.add(wk.id); select({ kind:'week', trackId: track.id, phaseId: ph.id, weekId: wk.id }); });
              wkWrap.appendChild(wkRow);

              if (wkOpen) {
                const lsWrap = document.createElement('div'); lsWrap.className = 'dt-children';
                wk.lessons.forEach((ls, i) => {
                  const lsRow = document.createElement('div');
                  lsRow.className = 'dt-node-row' + (selected && selected.kind === 'lesson' && selected.weekId === wk.id && selected.lessonIdx === i ? ' selected' : '');
                  lsRow.innerHTML = `<span class="dt-chev" style="visibility:hidden">${Icon('chevronRight',{size:13})}</span><span class="dt-label">${escapeHtml(ls.title || 'Untitled')}</span>`;
                  lsRow.addEventListener('click', (e) => { e.stopPropagation(); select({ kind:'lesson', trackId: track.id, phaseId: ph.id, weekId: wk.id, lessonIdx: i }); });
                  lsWrap.appendChild(lsRow);
                });
                const addLs = document.createElement('div'); addLs.className = 'dt-add-row';
                addLs.innerHTML = `${Icon('plus',{size:12})} Add lesson`;
                addLs.addEventListener('click', (e) => { e.stopPropagation(); Content.addLesson(ph.id, wk.id); const w = Content.get().PHASES.find(p=>p.id===ph.id).weeksList.find(w=>w.id===wk.id); select({ kind:'lesson', trackId: track.id, phaseId: ph.id, weekId: wk.id, lessonIdx: w.lessons.length - 1 }); toast('Lesson added'); });
                lsWrap.appendChild(addLs);
                wkWrap.appendChild(lsWrap);
              }
            });
            const addWk = document.createElement('div'); addWk.className = 'dt-add-row';
            addWk.innerHTML = `${Icon('plus',{size:12})} Add week`;
            addWk.addEventListener('click', (e) => { e.stopPropagation(); Content.addWeek(ph.id); expanded.add(ph.id); toast('Week added'); buildTree(); });
            wkWrap.appendChild(addWk);
            children.appendChild(wkWrap);
          }
        });
        const addPh = document.createElement('div'); addPh.className = 'dt-add-row';
        addPh.innerHTML = `${Icon('plus',{size:12})} Add phase`;
        addPh.addEventListener('click', (e) => { e.stopPropagation(); Content.addPhase(track.id); expanded.add(track.id); toast('Phase added'); buildTree(); });
        children.appendChild(addPh);
        node.appendChild(children);
      }
      treeEl.appendChild(node);
    });
    const addTrackRow = document.createElement('div'); addTrackRow.className = 'dt-add-row'; addTrackRow.style.marginLeft = '0';
    addTrackRow.innerHTML = `${Icon('plus',{size:12})} Add track`;
    addTrackRow.addEventListener('click', () => { Content.addTrack({ name:'New Track', badge:'NEW' }); toast('Track added'); buildTree(); });
    treeEl.appendChild(addTrackRow);
  }

  /* ---------------------------- MAIN PANEL ---------------------------- */
  function buildMain() {
    mainEl.innerHTML = '';
    if (!selected) {
      mainEl.innerHTML = `<div class="dt-empty">${Icon('folder',{size:40})}<p>Select a track, phase, week or lesson on the left to edit it -- or use "Add track" to start something new.</p></div>`;
      return;
    }
    const { TRACKS, PHASES } = Content.get();
    if (selected.kind === 'track') return buildTrackForm(TRACKS.find(t => t.id === selected.trackId));
    if (selected.kind === 'phase') return buildPhaseForm(PHASES.find(p => p.id === selected.phaseId));
    if (selected.kind === 'week') {
      const ph = PHASES.find(p => p.id === selected.phaseId);
      return buildWeekForm(ph, ph.weeksList.find(w => w.id === selected.weekId));
    }
    if (selected.kind === 'lesson') {
      const ph = PHASES.find(p => p.id === selected.phaseId);
      const wk = ph.weeksList.find(w => w.id === selected.weekId);
      return buildLessonForm(ph, wk, wk.lessons[selected.lessonIdx], selected.lessonIdx);
    }
  }

  function field(labelText, inputHtml, hint) {
    const wrap = document.createElement('div'); wrap.className = 'dt-field';
    wrap.innerHTML = `<label>${escapeHtml(labelText)}${hint ? `<span class="hint">${escapeHtml(hint)}</span>` : ''}</label>`;
    const holder = document.createElement('div'); holder.innerHTML = inputHtml;
    wrap.appendChild(holder.firstElementChild);
    return wrap;
  }
  function formHead(title, typeBadge, actions) {
    const head = document.createElement('div'); head.className = 'dt-form-head';
    head.innerHTML = `<h2>${escapeHtml(title)} <span class="dt-type-badge">${escapeHtml(typeBadge)}</span></h2>`;
    const act = document.createElement('div'); act.className = 'dt-actions';
    (actions || []).forEach(a => act.appendChild(a));
    head.appendChild(act);
    return head;
  }
  function delBtn(onClick, label) {
    const b = document.createElement('button'); b.className = 'btn btn-sm btn-danger';
    b.innerHTML = `${Icon('trash',{size:13})} ${escapeHtml(label || 'Delete')}`;
    b.addEventListener('click', onClick);
    return b;
  }

  function buildTrackForm(track) {
    if (!track) return;
    mainEl.appendChild(formHead(track.name, 'Track', [delBtn(() => confirmModal('Delete this track?', `"${track.name}" and all its phases will be removed.`, () => { Content.deleteTrack(track.id); selected = null; toast('Track deleted'); buildTree(); buildMain(); }))]));

    const idField = field('Track ID', `<input type="text" value="${escapeHtml(track.id)}" disabled style="opacity:.6">`, 'set automatically, used in URLs');
    const row = document.createElement('div'); row.className = 'dt-row2';
    row.appendChild(field('Name', `<input type="text" id="f-name" value="${escapeHtml(track.name)}">`));
    row.appendChild(field('Badge (short label, max 4 chars)', `<input type="text" id="f-badge" value="${escapeHtml(track.badge)}" maxlength="4">`));
    const blurb = field('Blurb', `<textarea id="f-blurb" rows="3">${escapeHtml(track.blurb || '')}</textarea>`);

    mainEl.appendChild(idField); mainEl.appendChild(row); mainEl.appendChild(blurb);

    const save = () => Content.updateTrack(track.id, {
      name: mainEl.querySelector('#f-name').value,
      badge: mainEl.querySelector('#f-badge').value.toUpperCase(),
      blurb: mainEl.querySelector('#f-blurb').value,
    });
    mainEl.querySelectorAll('input,textarea').forEach(elm => elm.addEventListener('input', () => { save(); }));
    mainEl.querySelectorAll('input,textarea').forEach(elm => elm.addEventListener('blur', () => { buildTree(); }));
  }

  function buildPhaseForm(ph) {
    if (!ph) return;
    mainEl.appendChild(formHead(ph.title, `Phase ${ph.num}`, [
      delBtn(() => confirmModal('Delete this phase?', `"${ph.title}" and all its weeks and lessons will be removed.`, () => { Content.deletePhase(ph.id); selected = null; toast('Phase deleted'); buildTree(); buildMain(); })),
    ]));

    const row = document.createElement('div'); row.className = 'dt-row2';
    row.appendChild(field('Title', `<input type="text" id="f-title" value="${escapeHtml(ph.title)}">`));
    row.appendChild(field('Weeks / duration label', `<input type="text" id="f-weeks" value="${escapeHtml(ph.weeks || '')}">`));
    mainEl.appendChild(row);

    const row2 = document.createElement('div'); row2.className = 'dt-row2';
    row2.appendChild(field('Mega project', `<input type="text" id="f-mega" value="${escapeHtml(ph.mega || '')}">`));
    row2.appendChild(field('Milestone', `<input type="text" id="f-milestone" value="${escapeHtml(ph.milestone || '')}">`));
    mainEl.appendChild(row2);

    mainEl.appendChild(field('Description', `<textarea id="f-desc" rows="3">${escapeHtml(ph.desc || '')}</textarea>`));

    const save = () => Content.updatePhase(ph.id, {
      title: mainEl.querySelector('#f-title').value,
      weeks: mainEl.querySelector('#f-weeks').value,
      mega: mainEl.querySelector('#f-mega').value,
      milestone: mainEl.querySelector('#f-milestone').value,
      desc: mainEl.querySelector('#f-desc').value,
    });
    mainEl.querySelectorAll('input,textarea').forEach(elm => { elm.addEventListener('input', save); elm.addEventListener('blur', buildTree); });

    if (ph.weeksList.length === 0) {
      const note = document.createElement('div'); note.className = 'callout info';
      note.innerHTML = `<div class="ci">${Icon('info',{size:18})}</div><div>This phase has no weeks yet. Use "Add week" in the tree on the left to start authoring lessons.</div>`;
      mainEl.appendChild(note);
    }
  }

  function buildWeekForm(ph, wk) {
    if (!wk) return;
    mainEl.appendChild(formHead(wk.title, `Week ${wk.num}`, [
      delBtn(() => confirmModal('Delete this week?', `"${wk.title}" and all its lessons will be removed.`, () => { Content.deleteWeek(ph.id, wk.id); selected = { kind:'phase', trackId: ph.track, phaseId: ph.id }; toast('Week deleted'); buildTree(); buildMain(); })),
    ]));
    const row = document.createElement('div'); row.className = 'dt-row2';
    row.appendChild(field('Title', `<input type="text" id="f-title" value="${escapeHtml(wk.title)}">`));
    row.appendChild(field('Number', `<input type="number" id="f-num" value="${wk.num}">`));
    mainEl.appendChild(row);
    const save = () => Content.updateWeek(ph.id, wk.id, { title: mainEl.querySelector('#f-title').value, num: Number(mainEl.querySelector('#f-num').value) || wk.num });
    mainEl.querySelectorAll('input').forEach(elm => { elm.addEventListener('input', save); elm.addEventListener('blur', buildTree); });
  }

  function buildLessonForm(ph, wk, lesson, idx) {
    if (!lesson) return;
    mainEl.appendChild(formHead(lesson.title || 'Untitled lesson', 'Lesson', [
      delBtn(() => confirmModal('Delete this lesson?', `"${lesson.title}" will be permanently removed.`, () => { Content.deleteLesson(ph.id, wk.id, idx); selected = { kind:'week', trackId: ph.track, phaseId: ph.id, weekId: wk.id }; toast('Lesson deleted'); buildTree(); buildMain(); })),
    ]));

    const row = document.createElement('div'); row.className = 'dt-row3';
    row.appendChild(field('Day label', `<input type="text" id="f-day" value="${escapeHtml(String(lesson.day||''))}">`));
    row.appendChild(field('Title', `<input type="text" id="f-title" value="${escapeHtml(lesson.title||'')}">`));
    row.appendChild(field('Project', `<input type="text" id="f-project" value="${escapeHtml(lesson.project||'')}">`));
    mainEl.appendChild(row);
    mainEl.appendChild(field('Tags (comma separated)', `<input type="text" id="f-tags" value="${escapeHtml((lesson.tags||[]).join(', '))}">`));

    const saveMeta = () => Content.updateLesson(ph.id, wk.id, idx, {
      day: mainEl.querySelector('#f-day').value,
      title: mainEl.querySelector('#f-title').value,
      project: mainEl.querySelector('#f-project').value,
      tags: mainEl.querySelector('#f-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    });
    mainEl.querySelectorAll('.dt-row3 input, #f-tags').forEach(elm => { elm.addEventListener('input', saveMeta); elm.addEventListener('blur', buildTree); });

    const moveRow = document.createElement('div'); moveRow.style.cssText = 'display:flex;gap:8px;margin:4px 0 22px';
    const upBtn = document.createElement('button'); upBtn.className = 'dt-icon-btn'; upBtn.innerHTML = Icon('arrowUp',{size:13}); upBtn.title = 'Move earlier';
    upBtn.addEventListener('click', () => { Content.moveLesson(ph.id, wk.id, idx, -1); selected.lessonIdx = Math.max(0, idx - 1); buildTree(); buildMain(); });
    const downBtn = document.createElement('button'); downBtn.className = 'dt-icon-btn'; downBtn.innerHTML = Icon('arrowDown',{size:13}); downBtn.title = 'Move later';
    downBtn.addEventListener('click', () => { Content.moveLesson(ph.id, wk.id, idx, 1); selected.lessonIdx = Math.min(wk.lessons.length - 1, idx + 1); buildTree(); buildMain(); });
    moveRow.appendChild(upBtn); moveRow.appendChild(downBtn);
    mainEl.appendChild(moveRow);

    const blocksHead = document.createElement('div'); blocksHead.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
    blocksHead.innerHTML = `<label style="font-size:12.5px;font-weight:600;color:var(--text-1)">Content blocks (${(lesson.content||[]).length})</label>`;
    mainEl.appendChild(blocksHead);

    const blocksWrap = document.createElement('div'); blocksWrap.className = 'dt-blocks';
    mainEl.appendChild(blocksWrap);
    renderBlockList(blocksWrap, ph, wk, lesson, idx);

    const addBlockRow = document.createElement('div'); addBlockRow.className = 'dt-add-block';
    addBlockRow.innerHTML = `${Icon('plus',{size:14})} Add content block`;
    addBlockRow.addEventListener('click', () => {
      const content = lesson.content || (lesson.content = []);
      content.push(blankBlock('p'));
      Content.updateLesson(ph.id, wk.id, idx, { content });
      buildMain();
    });
    mainEl.appendChild(addBlockRow);

    const previewBtn = document.createElement('a'); previewBtn.className = 'btn btn-ghost btn-sm'; previewBtn.style.marginTop = '18px';
    previewBtn.innerHTML = `${Icon('external',{size:13})} Preview this lesson`;
    previewBtn.href = '#';
    previewBtn.addEventListener('click', (e) => { e.preventDefault(); const uid = Content.get().ALL_LESSONS.find(l => l.phaseId === ph.id && l.weekId === wk.id && l.day === lesson.day && l.title === lesson.title); if (uid) window.open(location.pathname + '#/lesson/' + uid.uid, '_blank'); });
    mainEl.appendChild(previewBtn);
  }

  function renderBlockList(wrap, ph, wk, lesson, lessonIdx) {
    wrap.innerHTML = '';
    (lesson.content || []).forEach((b, bi) => {
      const card = document.createElement('div'); card.className = 'dt-block';
      const head = document.createElement('div'); head.className = 'dt-block-head';
      const typeSel = document.createElement('select');
      BLOCK_TYPES.forEach(bt => { const o = document.createElement('option'); o.value = bt.t; o.textContent = bt.label; if (bt.t === b.t) o.selected = true; typeSel.appendChild(o); });
      typeSel.addEventListener('change', () => {
        lesson.content[bi] = blankBlock(typeSel.value);
        Content.updateLesson(ph.id, wk.id, lessonIdx, { content: lesson.content });
        renderBlockList(wrap, ph, wk, lesson, lessonIdx);
      });
      head.appendChild(typeSel);
      const spacer = document.createElement('span'); spacer.className = 'spacer'; head.appendChild(spacer);
      const actions = document.createElement('div'); actions.className = 'dt-block-actions';
      const up = document.createElement('button'); up.className = 'dt-icon-btn'; up.innerHTML = Icon('arrowUp',{size:12});
      up.addEventListener('click', () => { if (bi===0) return; [lesson.content[bi-1], lesson.content[bi]] = [lesson.content[bi], lesson.content[bi-1]]; Content.updateLesson(ph.id, wk.id, lessonIdx, { content: lesson.content }); renderBlockList(wrap, ph, wk, lesson, lessonIdx); });
      const down = document.createElement('button'); down.className = 'dt-icon-btn'; down.innerHTML = Icon('arrowDown',{size:12});
      down.addEventListener('click', () => { if (bi===lesson.content.length-1) return; [lesson.content[bi+1], lesson.content[bi]] = [lesson.content[bi], lesson.content[bi+1]]; Content.updateLesson(ph.id, wk.id, lessonIdx, { content: lesson.content }); renderBlockList(wrap, ph, wk, lesson, lessonIdx); });
      const del = document.createElement('button'); del.className = 'dt-icon-btn danger'; del.innerHTML = Icon('trash',{size:12});
      del.addEventListener('click', () => { lesson.content.splice(bi, 1); Content.updateLesson(ph.id, wk.id, lessonIdx, { content: lesson.content }); renderBlockList(wrap, ph, wk, lesson, lessonIdx); buildMain(); });
      actions.appendChild(up); actions.appendChild(down); actions.appendChild(del);
      head.appendChild(actions);
      card.appendChild(head);

      const body = document.createElement('div'); body.className = 'dt-block-body';
      body.appendChild(buildBlockBody(b, () => { Content.updateLesson(ph.id, wk.id, lessonIdx, { content: lesson.content }); }));
      card.appendChild(body);
      wrap.appendChild(card);
    });
  }

  function buildBlockBody(b, onChange) {
    const wrap = document.createElement('div');
    const mkText = (labelText, key, isArea) => {
      const f = document.createElement('div'); f.className = 'dt-field'; f.style.marginBottom = '10px';
      f.innerHTML = `<label>${escapeHtml(labelText)}</label>`;
      const input = document.createElement(isArea ? 'textarea' : 'input');
      if (!isArea) input.type = 'text';
      input.value = b[key] || '';
      if (isArea) input.rows = key === 'code' ? 8 : 3;
      if (key === 'code' || key === 'req' || key === 'res') input.style.fontFamily = 'var(--font-mono)';
      input.addEventListener('input', () => { b[key] = input.value; onChange(); });
      f.appendChild(input);
      return f;
    };
    const mkListEditor = (labelText, key) => {
      const f = document.createElement('div'); f.className = 'dt-field dt-list-editor';
      f.innerHTML = `<label>${escapeHtml(labelText)}</label>`;
      const listWrap = document.createElement('div');
      const items = b[key] || (b[key] = []);
      function draw() {
        listWrap.innerHTML = '';
        items.forEach((val, i) => {
          const row = document.createElement('div'); row.className = 'dt-list-row';
          const inp = document.createElement('input'); inp.type = 'text'; inp.value = val;
          inp.addEventListener('input', () => { items[i] = inp.value; onChange(); });
          const rm = document.createElement('button'); rm.className = 'dt-icon-btn danger'; rm.innerHTML = Icon('trash',{size:12});
          rm.addEventListener('click', () => { items.splice(i, 1); onChange(); draw(); });
          row.appendChild(inp); row.appendChild(rm);
          listWrap.appendChild(row);
        });
        const add = document.createElement('button'); add.className = 'btn btn-sm btn-ghost'; add.style.marginTop = '4px';
        add.innerHTML = `${Icon('plus',{size:12})} Add item`;
        add.addEventListener('click', () => { items.push('New item'); onChange(); draw(); });
        listWrap.appendChild(add);
      }
      draw();
      f.appendChild(listWrap);
      return f;
    };

    if (b.t === 'h2' || b.t === 'h3') wrap.appendChild(mkText('Text', 'x'));
    else if (b.t === 'p') wrap.appendChild(mkText('Text (supports **bold**, *em*, `code`)', 'x', true));
    else if (b.t === 'ul' || b.t === 'ol') wrap.appendChild(mkListEditor('List items', 'items'));
    else if (b.t === 'obj') wrap.appendChild(mkListEditor('Objectives', 'items'));
    else if (b.t === 'callout') {
      const kindField = document.createElement('div'); kindField.className = 'dt-field'; kindField.style.marginBottom = '10px';
      kindField.innerHTML = `<label>Kind</label>`;
      const sel = document.createElement('select');
      ['tip','warn','info'].forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = k; if (b.kind === k) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', () => { b.kind = sel.value; onChange(); });
      kindField.appendChild(sel);
      wrap.appendChild(kindField);
      wrap.appendChild(mkText('Text', 'x', true));
    }
    else if (b.t === 'play') {
      const row = document.createElement('div'); row.className = 'dt-row2';
      row.appendChild(mkText('Filename / title', 'title'));
      wrap.appendChild(row);
      wrap.appendChild(mkText('Python code', 'code', true));
    }
    else if (b.t === 'quiz') {
      wrap.appendChild(mkText('Question', 'q'));
      wrap.appendChild(mkListEditor('Options', 'options'));
      const ansField = document.createElement('div'); ansField.className = 'dt-field';
      ansField.innerHTML = `<label>Correct option index (0-based)</label>`;
      const ansInput = document.createElement('input'); ansInput.type = 'number'; ansInput.min = 0; ansInput.value = b.answer || 0;
      ansInput.addEventListener('input', () => { b.answer = Number(ansInput.value) || 0; onChange(); });
      ansField.appendChild(ansInput);
      wrap.appendChild(ansField);
      wrap.appendChild(mkText('Explanation', 'explain', true));
    }
    else if (b.t === 'apisim') {
      const row = document.createElement('div'); row.className = 'dt-row2';
      const methodField = document.createElement('div'); methodField.className = 'dt-field';
      methodField.innerHTML = `<label>Method</label>`;
      const sel = document.createElement('select');
      ['GET','POST','PUT','DELETE'].forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; if (b.method === m) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', () => { b.method = sel.value; onChange(); });
      methodField.appendChild(sel);
      row.appendChild(methodField);
      row.appendChild((() => { const f = mkText('Path', 'path'); return f; })());
      wrap.appendChild(row);
      wrap.appendChild(mkText('Request', 'req', true));
      const statusField = document.createElement('div'); statusField.className = 'dt-field';
      statusField.innerHTML = `<label>Status code</label>`;
      const statusInput = document.createElement('input'); statusInput.type = 'number'; statusInput.value = b.status || 200;
      statusInput.addEventListener('input', () => { b.status = Number(statusInput.value) || 200; onChange(); });
      statusField.appendChild(statusInput);
      wrap.appendChild(statusField);
      wrap.appendChild(mkText('Response', 'res', true));
    }
    return wrap;
  }

  return { render };
})();

window.DevTool = DevTool;
