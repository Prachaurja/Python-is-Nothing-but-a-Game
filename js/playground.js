/* =========================================================================
   PLAYGROUND — real Python in the browser via Pyodide (WebAssembly)
   Lazily loads Pyodide on first run so the site stays fast.
   ========================================================================= */

const Py = (() => {
  let pyodide = null;
  let loading = null;
  const listeners = [];

  function onStatus(cb) { listeners.push(cb); }
  function emit(state) { listeners.forEach(cb => cb(state)); }

  async function ensure() {
    if (pyodide) return pyodide;
    if (loading) return loading;
    emit('loading');
    loading = (async () => {
      // Load the Pyodide loader script from CDN if not already present
      if (typeof loadPyodide === 'undefined') {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(s);
        });
      }
      pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
      emit('ready');
      return pyodide;
    })();
    return loading;
  }

  // Kick off loading in the background (idle) so the first Run feels instant-ish
  function warm() {
    if (!pyodide && !loading) {
      if ('requestIdleCallback' in window) requestIdleCallback(() => ensure().catch(()=>{}), { timeout: 4000 });
      else setTimeout(() => ensure().catch(()=>{}), 2500);
    }
  }

  async function run(code, { onStdout } = {}) {
    const py = await ensure();
    // Capture stdout/stderr
    py.setStdout({ batched: (s) => onStdout && onStdout(s, false) });
    py.setStderr({ batched: (s) => onStdout && onStdout(s, true) });
    try {
      // Run in a fresh namespace each time to avoid leakage between snippets
      const result = await py.runPythonAsync(code);
      if (result !== undefined && result !== null) {
        const str = result.toString();
        if (str && str !== 'undefined') onStdout && onStdout('\n=> ' + str, false);
      }
      return { ok: true };
    } catch (err) {
      const msg = (err && err.message) ? err.message : String(err);
      // Trim the noisy Pyodide traceback preamble, keep the Python part
      const cleaned = msg.replace(/^.*?PythonError:\s*/s, '').trim();
      onStdout && onStdout('\n' + cleaned, true);
      return { ok: false, error: cleaned };
    }
  }

  return { ensure, warm, run, onStatus, get ready() { return !!pyodide; } };
})();

/* -------------------------------------------------------------------------
   Build a playground widget into a container element.
   opts: { code, title, full }  -> returns { run, getCode }
   Uses CodeMirror if available, falls back to a <textarea>.
   ------------------------------------------------------------------------- */
function createPlayground(container, { code = '', title = 'main.py', full = false } = {}) {
  container.classList.add('pg-embed');
  container.innerHTML = `
    <div class="pg-toolbar">
      <span class="pg-title">${Icon('file',{size:13})} ${escapeHtml(title)}</span>
      <span class="spacer"></span>
      <span class="pyodide-status"><span class="spin"></span><span class="ps-label">python...</span></span>
      <button class="pg-btn2 pg-reset" title="Reset code">${Icon('reset',{size:13})} Reset</button>
      <button class="pg-run">${Icon('play',{size:13})} Run</button>
    </div>
    <div class="pg-editor${full ? ' pg-editor-full' : ''}"></div>
    <div class="pg-output">
      <div class="out-head">Output <span class="spacer" style="flex:1"></span><span class="pg-clear" style="cursor:pointer">clear</span></div>
      <div class="pg-out-body"><div class="empty">Press Run to execute this Python -- really, right here in your browser.</div></div>
    </div>`;

  const editorHost = container.querySelector('.pg-editor');
  const runBtn = container.querySelector('.pg-run');
  const resetBtn = container.querySelector('.pg-reset');
  const clearBtn = container.querySelector('.pg-clear');
  const outBody = container.querySelector('.pg-out-body');
  const statusEl = container.querySelector('.pyodide-status');
  const statusLabel = container.querySelector('.ps-label');
  const original = code;

  // Editor: CodeMirror if present
  let cm = null, textarea = null;
  if (window.CodeMirror) {
    cm = window.CodeMirror(editorHost, {
      value: code,
      mode: 'python',
      theme: 'py-dark',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      autofocus: false,
      viewportMargin: full ? Infinity : 30,
      extraKeys: {
        'Ctrl-Enter': () => execute(),
        'Cmd-Enter': () => execute(),
        Tab: (cmi) => cmi.replaceSelection('    ', 'end'),
      },
    });
  } else {
    textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.spellcheck = false;
    textarea.style.cssText = 'width:100%;min-height:140px;background:var(--bg-1);color:var(--text-0);border:none;padding:14px;font-family:var(--font-mono);font-size:14px;resize:vertical;outline:none;';
    editorHost.appendChild(textarea);
  }

  const getCode = () => cm ? cm.getValue() : textarea.value;
  const setCode = (v) => cm ? cm.setValue(v) : (textarea.value = v);

  Py.onStatus((state) => {
    if (state === 'ready') { statusEl.classList.add('ready'); statusLabel.textContent = 'ready'; }
    else if (state === 'loading') { statusLabel.textContent = 'loading...'; }
  });
  if (Py.ready) { statusEl.classList.add('ready'); statusLabel.textContent = 'ready'; }

  function printOut(text, isErr) {
    const empty = outBody.querySelector('.empty');
    if (empty) empty.remove();
    let pre = outBody.querySelector('pre');
    if (!pre) { pre = document.createElement('pre'); outBody.appendChild(pre); }
    const span = document.createElement('span');
    if (isErr) span.className = 'err';
    span.textContent = text;
    pre.appendChild(span);
    outBody.scrollTop = outBody.scrollHeight;
  }

  async function execute() {
    runBtn.disabled = true;
    runBtn.innerHTML = Py.ready ? 'Running...' : 'Loading Python...';
    outBody.innerHTML = '';
    const pre = document.createElement('pre');
    outBody.appendChild(pre);
    try {
      await Py.run(getCode(), { onStdout: (s, isErr) => printOut(s, isErr) });
    } catch (e) {
      printOut('\nRuntime error: ' + e.message, true);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = `${Icon('play',{size:13})} Run`;
      if (!outBody.textContent.trim()) outBody.innerHTML = `<div class="empty ok" style="color:var(--green)">${Icon('check',{size:12})} Ran with no output.</div>`;
    }
  }

  runBtn.addEventListener('click', execute);
  resetBtn.addEventListener('click', () => { setCode(original); outBody.innerHTML = '<div class="empty">Reset. Press ▶ Run.</div>'; });
  clearBtn.addEventListener('click', () => { outBody.innerHTML = '<div class="empty">Cleared.</div>'; });

  // warm pyodide when a playground first appears
  Py.warm();

  return { execute, getCode, setCode };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

window.Py = Py;
window.createPlayground = createPlayground;
window.escapeHtml = escapeHtml;
