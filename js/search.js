// Lumen — 本地搜索（Fuse.js）
(() => {
  if (!window.Fuse) return;

  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!panel || !input || !results) return;

  let fuse = null;
  let indexLoaded = false;

  async function ensureIndex() {
    if (indexLoaded) return;
    const url = '/search.json';
    try {
      const res = await fetch(url);
      const docs = await res.json();
      fuse = new window.Fuse(docs, {
        keys: ['title', 'content', 'tags'],
        threshold: 0.4,
        includeScore: false,
        minMatchCharLength: 2,
      });
      indexLoaded = true;
    } catch (e) {
      results.innerHTML = '<p class="search-panel__empty">搜索索引加载失败</p>';
    }
  }

  function openPanel() {
    panel.hidden = false;
    setTimeout(() => input.focus(), 30);
    ensureIndex();
  }
  function closePanel() {
    panel.hidden = true;
    input.value = '';
    results.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    if (t.dataset.action === 'open-search')  { e.preventDefault(); openPanel(); }
    if (t.dataset.action === 'close-search') { closePanel(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); openPanel();
    }
  });

  document.addEventListener('click', (e) => {
    if (panel.hidden) return;
    if (!panel.contains(e.target) && !e.target.closest('[data-action="open-search"]')) closePanel();
  });

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 100);
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function run() {
    if (!fuse) {
      results.innerHTML = '<p class="search-panel__empty">索引未就绪</p>';
      return;
    }
    const q = input.value.trim();
    if (!q) { results.innerHTML = '<p class="search-panel__empty">输入关键词开始搜索</p>'; return; }
    const hits = fuse.search(q, { limit: 10 }).map(r => r.item);
    if (!hits.length) { results.innerHTML = '<p class="search-panel__empty">没有匹配的文章</p>'; return; }
    results.innerHTML = hits.map(h => `
      <a class="search-panel__result" href="${h.url}">
        <div class="search-panel__result-title">${escapeHtml(h.title)}</div>
        <div class="search-panel__result-snippet">${escapeHtml((h.content || '').slice(0, 80))}…</div>
      </a>
    `).join('');
  }
})();