/* =========================================================================
   VISUALIZERS — animated DSA. Sorting, searching, graph traversal, tree.
   Each returns a controller with mount()/destroy(). Pure vanilla + canvas.
   ========================================================================= */

const Viz = (() => {

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const rand = (n, max = 100) => Array.from({ length: n }, () => 5 + Math.floor(Math.random() * max));

  /* ---------------- SORTING ---------------- */
  function sorting(host) {
    let arr = rand(30);
    let running = false, cancel = false;
    let speed = 60, size = 30, algo = 'bubble';
    let comparisons = 0, swaps = 0;

    host.innerHTML = `
      <div class="viz-controls">
        <label>Algorithm
          <select class="v-algo">
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
          </select>
        </label>
        <label>Size <input type="range" class="v-size" min="8" max="70" value="30"></label>
        <label>Speed <input type="range" class="v-speed" min="1" max="100" value="60"></label>
        <button class="btn btn-ghost v-shuffle">${Icon('shuffle',{size:14})} Shuffle</button>
        <button class="btn btn-primary v-run">${Icon('play',{size:14})} Sort</button>
      </div>
      <div class="viz-stage"></div>
      <div class="viz-info">
        <span>Comparisons: <b class="v-cmp">0</b></span>
        <span>Swaps/Writes: <b class="v-swp">0</b></span>
        <span>Complexity: <b class="v-cx">O(n^2)</b></span>
      </div>`;

    const stage = host.querySelector('.viz-stage');
    const cmpEl = host.querySelector('.v-cmp'), swpEl = host.querySelector('.v-swp'), cxEl = host.querySelector('.v-cx');
    const complexities = { bubble:'O(n^2)', selection:'O(n^2)', insertion:'O(n^2)', quick:'O(n log n)', merge:'O(n log n)' };

    function draw(states = {}) {
      const max = Math.max(...arr);
      stage.innerHTML = '';
      arr.forEach((v, i) => {
        const bar = document.createElement('div');
        bar.className = 'viz-bar';
        if (states.sorted && states.sorted.includes(i)) bar.classList.add('sorted');
        if (states.compare && states.compare.includes(i)) bar.classList.add('compare');
        if (states.swap && states.swap.includes(i)) bar.classList.add('swap');
        if (states.pivot === i) bar.classList.add('pivot');
        bar.style.height = (v / max * 300) + 'px';
        stage.appendChild(bar);
      });
      cmpEl.textContent = comparisons; swpEl.textContent = swaps;
    }
    function reset() { comparisons = swaps = 0; arr = rand(size); draw(); }

    async function tick() { await sleep(101 - speed); return !cancel; }

    async function bubble() {
      const n = arr.length, sorted = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++; draw({ compare:[j, j+1], sorted });
          if (!(await tick())) return;
          if (arr[j] > arr[j+1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; swaps++; draw({ swap:[j, j+1], sorted }); if (!(await tick())) return; }
        }
        sorted.unshift(n - i - 1);
      }
      draw({ sorted: arr.map((_, i) => i) });
    }
    async function selection() {
      const n = arr.length, sorted = [];
      for (let i = 0; i < n; i++) {
        let min = i;
        for (let j = i+1; j < n; j++) { comparisons++; draw({ compare:[min, j], sorted }); if (!(await tick())) return; if (arr[j] < arr[min]) min = j; }
        if (min !== i) { [arr[i], arr[min]] = [arr[min], arr[i]]; swaps++; }
        sorted.push(i); draw({ swap:[i, min], sorted });
      }
      draw({ sorted: arr.map((_, i) => i) });
    }
    async function insertion() {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        let key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) { comparisons++; arr[j+1] = arr[j]; swaps++; j--; draw({ compare:[j+1], sorted: range(0, i) }); if (!(await tick())) return; }
        arr[j+1] = key;
      }
      draw({ sorted: arr.map((_, i) => i) });
    }
    async function quick() {
      async function qs(lo, hi) {
        if (lo >= hi) return true;
        const pivot = arr[hi]; let i = lo;
        for (let j = lo; j < hi; j++) {
          comparisons++; draw({ compare:[j], pivot: hi }); if (!(await tick())) return false;
          if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; swaps++; draw({ swap:[i, j], pivot: hi }); if (!(await tick())) return false; i++; }
        }
        [arr[i], arr[hi]] = [arr[hi], arr[i]]; swaps++;
        return (await qs(lo, i-1)) && (await qs(i+1, hi));
      }
      const done = await qs(0, arr.length - 1);
      if (done) draw({ sorted: arr.map((_, i) => i) });
    }
    async function merge() {
      async function ms(lo, hi) {
        if (lo >= hi) return true;
        const mid = (lo + hi) >> 1;
        if (!(await ms(lo, mid))) return false;
        if (!(await ms(mid+1, hi))) return false;
        const merged = []; let i = lo, j = mid+1;
        while (i <= mid && j <= hi) { comparisons++; merged.push(arr[i] <= arr[j] ? arr[i++] : arr[j++]); }
        while (i <= mid) merged.push(arr[i++]);
        while (j <= hi) merged.push(arr[j++]);
        for (let k = 0; k < merged.length; k++) { arr[lo+k] = merged[k]; swaps++; draw({ compare:[lo+k], sorted: range(lo, lo+k+1) }); if (!(await tick())) return false; }
        return true;
      }
      const done = await ms(0, arr.length - 1);
      if (done) draw({ sorted: arr.map((_, i) => i) });
    }
    const runners = { bubble, selection, insertion, quick, merge };

    async function run() {
      if (running) { cancel = true; return; }
      running = true; cancel = false;
      host.querySelector('.v-run').innerHTML = `${Icon('stop',{size:14})} Stop`;
      comparisons = swaps = 0;
      await runners[algo]();
      running = false; cancel = false;
      host.querySelector('.v-run').innerHTML = `${Icon('play',{size:14})} Sort`;
    }

    host.querySelector('.v-algo').addEventListener('change', e => { algo = e.target.value; cxEl.textContent = complexities[algo]; if (!running) reset(); });
    host.querySelector('.v-size').addEventListener('input', e => { size = +e.target.value; if (!running) reset(); });
    host.querySelector('.v-speed').addEventListener('input', e => { speed = +e.target.value; });
    host.querySelector('.v-shuffle').addEventListener('click', () => { if (!running) reset(); });
    host.querySelector('.v-run').addEventListener('click', run);

    function range(a, b) { return Array.from({ length: b - a }, (_, i) => a + i); }
    reset();
    return { destroy() { cancel = true; } };
  }

  /* ---------------- SEARCHING (binary search) ---------------- */
  function searching(host) {
    let arr = [], target = 0, running = false, cancel = false, speed = 55;
    host.innerHTML = `
      <div class="viz-controls">
        <label>Target <input type="number" class="v-target" style="width:80px;padding:8px;border-radius:8px;background:var(--bg-3);color:var(--text-0);border:1px solid var(--border)"></label>
        <label>Speed <input type="range" class="v-speed" min="1" max="100" value="55"></label>
        <button class="btn btn-ghost v-new">${Icon('shuffle',{size:14})} New Array</button>
        <button class="btn btn-primary v-run">${Icon('play',{size:14})} Binary Search</button>
      </div>
      <div class="viz-stage" style="align-items:stretch;flex-wrap:wrap;gap:6px"></div>
      <div class="viz-info">
        <span>Steps: <b class="v-steps">0</b></span>
        <span>Range: <b class="v-range">-</b></span>
        <span>Complexity: <b>O(log n)</b></span>
        <span class="v-result" style="color:var(--green)"></span>
      </div>`;
    const stage = host.querySelector('.viz-stage');
    const stepsEl = host.querySelector('.v-steps'), rangeEl = host.querySelector('.v-range'), resEl = host.querySelector('.v-result');

    function newArr() {
      const n = 15;
      const set = new Set();
      while (set.size < n) set.add(2 + Math.floor(Math.random() * 98));
      arr = [...set].sort((a, b) => a - b);
      target = arr[Math.floor(Math.random() * n)];
      host.querySelector('.v-target').value = target;
      draw({});
      resEl.textContent = ''; stepsEl.textContent = '0'; rangeEl.textContent = '-';
    }
    function draw({ lo, hi, mid, found }) {
      stage.innerHTML = '';
      arr.forEach((v, i) => {
        const cell = document.createElement('div');
        const inRange = lo !== undefined && i >= lo && i <= hi;
        cell.textContent = v;
        cell.style.cssText = `min-width:44px;height:56px;display:grid;place-items:center;border-radius:10px;font-family:var(--font-mono);font-weight:700;font-size:15px;transition:all .25s;border:2px solid var(--border);`;
        if (lo === undefined) { cell.style.background = 'var(--bg-3)'; cell.style.color = 'var(--text-2)'; }
        else if (!inRange) { cell.style.background = 'var(--bg-2)'; cell.style.color = 'var(--text-3)'; cell.style.opacity = '.4'; }
        else { cell.style.background = 'var(--bg-3)'; cell.style.color = 'var(--text-1)'; }
        if (i === mid) { cell.style.background = found ? 'var(--green)' : 'var(--amber)'; cell.style.color = '#0a0e17'; cell.style.borderColor = found ? 'var(--green)' : 'var(--amber)'; cell.style.transform = 'translateY(-6px) scale(1.08)'; }
        stage.appendChild(cell);
      });
    }
    async function run() {
      if (running) return;
      running = true; cancel = false; resEl.textContent = '';
      target = +host.querySelector('.v-target').value || target;
      let lo = 0, hi = arr.length - 1, steps = 0;
      while (lo <= hi) {
        steps++; const mid = (lo + hi) >> 1;
        stepsEl.textContent = steps; rangeEl.textContent = `[${lo}, ${hi}]`;
        draw({ lo, hi, mid });
        await sleep(600 - speed * 5);
        if (cancel) { running = false; return; }
        if (arr[mid] === target) { draw({ lo, hi, mid, found: true }); resEl.textContent = `Found ${target} at index ${mid} in ${steps} steps`; running = false; return; }
        if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
      }
      resEl.style.color = 'var(--red)'; resEl.textContent = `${target} not in array (${steps} steps)`;
      running = false;
    }
    host.querySelector('.v-new').addEventListener('click', newArr);
    host.querySelector('.v-run').addEventListener('click', run);
    host.querySelector('.v-speed').addEventListener('input', e => speed = +e.target.value);
    newArr();
    return { destroy() { cancel = true; } };
  }

  /* ---------------- GRAPH (BFS / DFS / Dijkstra flood) ---------------- */
  function graph(host) {
    host.innerHTML = `
      <div class="viz-controls">
        <label>Algorithm
          <select class="v-algo">
            <option value="bfs">BFS (breadth-first)</option>
            <option value="dfs">DFS (depth-first)</option>
          </select>
        </label>
        <label>Speed <input type="range" class="v-speed" min="1" max="100" value="55"></label>
        <button class="btn btn-ghost v-new">${Icon('shuffle',{size:14})} New Graph</button>
        <button class="btn btn-primary v-run">${Icon('play',{size:14})} Traverse from A</button>
      </div>
      <canvas class="viz-canvas"></canvas>
      <div class="viz-info"><span>Visit order: <b class="v-order">-</b></span></div>`;
    const canvas = host.querySelector('.viz-canvas');
    const orderEl = host.querySelector('.v-order');
    let nodes = [], edges = [], adj = {}, running = false, cancel = false, speed = 55;

    function resize() { canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; }
    function newGraph() {
      const labels = 'ABCDEFGH'.split('');
      const W = canvas.clientWidth, H = canvas.clientHeight;
      nodes = labels.map((l, i) => {
        const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        return { id: l, x: W/2 + Math.cos(angle) * (W*0.30), y: H/2 + Math.sin(angle) * (H*0.34), state: 0 };
      });
      adj = {}; labels.forEach(l => adj[l] = []);
      edges = [];
      // connect ring + random chords
      for (let i = 0; i < labels.length; i++) {
        const a = labels[i], b = labels[(i+1) % labels.length];
        edges.push([a, b]); adj[a].push(b); adj[b].push(a);
      }
      for (let k = 0; k < 4; k++) {
        const a = labels[Math.floor(Math.random()*labels.length)];
        const b = labels[Math.floor(Math.random()*labels.length)];
        if (a !== b && !adj[a].includes(b)) { edges.push([a, b]); adj[a].push(b); adj[b].push(a); }
      }
      Object.values(adj).forEach(l => l.sort());
      draw(); orderEl.textContent = '-';
    }
    function nodeById(id) { return nodes.find(n => n.id === id); }
    function draw(active) {
      resize();
      const ctx = canvas.getContext('2d'); ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const css = getComputedStyle(document.documentElement);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // edges
      ctx.lineWidth = 2; ctx.strokeStyle = css.getPropertyValue('--border') || '#263049';
      edges.forEach(([a, b]) => { const na = nodeById(a), nb = nodeById(b); ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke(); });
      // nodes
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, Math.PI*2);
        let fill = css.getPropertyValue('--bg-3');
        if (n.state === 1) fill = css.getPropertyValue('--amber');   // frontier
        if (n.state === 2) fill = css.getPropertyValue('--green');   // visited
        if (n.id === active) fill = css.getPropertyValue('--accent');
        ctx.fillStyle = fill; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = css.getPropertyValue('--accent'); ctx.stroke();
        ctx.fillStyle = (n.state || n.id === active) ? '#0a0e17' : (css.getPropertyValue('--text-0') || '#fff');
        ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.id, n.x, n.y);
      });
    }
    async function run() {
      if (running) { cancel = true; return; }
      running = true; cancel = false; nodes.forEach(n => n.state = 0);
      const algo = host.querySelector('.v-algo').value;
      const order = [], seen = new Set(['A']);
      const frontier = ['A']; nodeById('A').state = 1; draw();
      while (frontier.length) {
        const cur = algo === 'bfs' ? frontier.shift() : frontier.pop();
        const node = nodeById(cur); node.state = 2; order.push(cur);
        orderEl.textContent = order.join(' -> ');
        draw(cur);
        await sleep(700 - speed * 6);
        if (cancel) break;
        for (const nb of adj[cur]) if (!seen.has(nb)) { seen.add(nb); frontier.push(nb); nodeById(nb).state = 1; }
        draw();
        await sleep(200);
        if (cancel) break;
      }
      draw();
      running = false; cancel = false;
    }
    host.querySelector('.v-new').addEventListener('click', () => { if (!running) newGraph(); });
    host.querySelector('.v-run').addEventListener('click', run);
    host.querySelector('.v-speed').addEventListener('input', e => speed = +e.target.value);
    setTimeout(newGraph, 30);
    const ro = new ResizeObserver(() => { if (!running) draw(); });
    ro.observe(canvas);
    return { destroy() { cancel = true; ro.disconnect(); } };
  }

  /* ---------------- BINARY TREE traversal ---------------- */
  function tree(host) {
    host.innerHTML = `
      <div class="viz-controls">
        <label>Traversal
          <select class="v-algo">
            <option value="in">In-order (L·Root·R)</option>
            <option value="pre">Pre-order (Root·L·R)</option>
            <option value="post">Post-order (L·R·Root)</option>
            <option value="level">Level-order (BFS)</option>
          </select>
        </label>
        <label>Speed <input type="range" class="v-speed" min="1" max="100" value="55"></label>
        <button class="btn btn-ghost v-new">${Icon('shuffle',{size:14})} New Tree</button>
        <button class="btn btn-primary v-run">${Icon('play',{size:14})} Traverse</button>
      </div>
      <canvas class="viz-canvas"></canvas>
      <div class="viz-info"><span>Order: <b class="v-order">-</b></span></div>`;
    const canvas = host.querySelector('.viz-canvas');
    const orderEl = host.querySelector('.v-order');
    let root = null, running = false, cancel = false, speed = 55;

    function insert(node, v) {
      if (!node) return { v, l: null, r: null, x: 0, y: 0, state: 0 };
      if (v < node.v) node.l = insert(node.l, v); else node.r = insert(node.r, v);
      return node;
    }
    function newTree() {
      root = null;
      const vals = new Set();
      while (vals.size < 9) vals.add(5 + Math.floor(Math.random() * 90));
      [...vals].forEach(v => root = insert(root, v));
      layout(); draw(); orderEl.textContent = '-';
    }
    function layout() {
      let i = 0; const depth = (n) => n ? 1 + Math.max(depth(n.l), depth(n.r)) : 0;
      const d = depth(root); const H = canvas.clientHeight || 400;
      function place(n, level) { if (!n) return; place(n.l, level+1); n.x = (++i); n.y = 40 + level * ((H - 80) / Math.max(d - 1, 1)); place(n.r, level+1); }
      place(root, 0);
      const W = canvas.clientWidth || 800; let count = 0; const countNodes = n => n ? 1 + countNodes(n.l) + countNodes(n.r) : 0;
      const total = countNodes(root);
      const scaleX = (idx) => (idx / (total + 1)) * W;
      const remap = (n) => { if (!n) return; n.x = scaleX(n.x); remap(n.l); remap(n.r); };
      remap(root);
    }
    function draw(active) {
      canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio;
      const ctx = canvas.getContext('2d'); ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const css = getComputedStyle(document.documentElement);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = css.getPropertyValue('--border'); ctx.lineWidth = 2;
      (function edges(n) { if (!n) return; [n.l, n.r].forEach(c => { if (c) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(c.x, c.y); ctx.stroke(); } }); edges(n.l); edges(n.r); })(root);
      (function draww(n) {
        if (!n) return; draww(n.l); draww(n.r);
        ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI*2);
        let fill = css.getPropertyValue('--bg-3');
        if (n.state === 2) fill = css.getPropertyValue('--green');
        if (n === active) fill = css.getPropertyValue('--amber');
        ctx.fillStyle = fill; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = css.getPropertyValue('--accent'); ctx.stroke();
        ctx.fillStyle = (n.state === 2 || n === active) ? '#0a0e17' : css.getPropertyValue('--text-0');
        ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.v, n.x, n.y);
      })(root);
    }
    async function visit(n) { n.state = 1; draw(n); await sleep(650 - speed * 5.5); n.state = 2; orderPush(n.v); draw(); }
    let order = [];
    function orderPush(v) { order.push(v); orderEl.textContent = order.join(' -> '); }
    async function run() {
      if (running) { cancel = true; return; }
      running = true; cancel = false; order = [];
      (function clr(n){ if(!n) return; n.state = 0; clr(n.l); clr(n.r); })(root); draw();
      const algo = host.querySelector('.v-algo').value;
      async function inorder(n){ if(!n||cancel) return; await inorder(n.l); await visit(n); await inorder(n.r); }
      async function preorder(n){ if(!n||cancel) return; await visit(n); await preorder(n.l); await preorder(n.r); }
      async function postorder(n){ if(!n||cancel) return; await postorder(n.l); await postorder(n.r); await visit(n); }
      async function level(){ const q=[root]; while(q.length&&!cancel){ const n=q.shift(); await visit(n); if(n.l)q.push(n.l); if(n.r)q.push(n.r); } }
      if (algo==='in') await inorder(root); else if (algo==='pre') await preorder(root); else if (algo==='post') await postorder(root); else await level();
      running = false; cancel = false;
    }
    host.querySelector('.v-new').addEventListener('click', () => { if (!running) newTree(); });
    host.querySelector('.v-run').addEventListener('click', run);
    host.querySelector('.v-speed').addEventListener('input', e => speed = +e.target.value);
    setTimeout(newTree, 30);
    const ro = new ResizeObserver(() => { if (!running) { layout(); draw(); } }); ro.observe(canvas);
    return { destroy() { cancel = true; ro.disconnect(); } };
  }

  return { sorting, searching, graph, tree };
})();

window.Viz = Viz;
