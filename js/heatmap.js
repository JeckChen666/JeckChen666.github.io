// Lumen — 写作热力图（最近 365 天）
(() => {
  const host = document.getElementById('heatmap');
  if (!host) return;
  const tip = document.getElementById('heatmap-tooltip');

  const posts = window.__SITE_POSTS__ || [];
  const counts = {};
  posts.forEach(p => {
    const d = (p.date || '').slice(0, 10);
    if (d) counts[d] = (counts[d] || 0) + 1;
  });

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  const startDow = start.getDay();
  start.setDate(start.getDate() - startDow);

  const frag = document.createDocumentFragment();
  let cur = new Date(start);
  while (cur <= today) {
    for (let d = 0; d < 7; d++) {
      if (cur > today) break;
      const key = cur.toISOString().slice(0, 10);
      const c = counts[key] || 0;
      const level = c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : 3;
      const cell = document.createElement('span');
      cell.className = 'heatmap__cell';
      cell.dataset.level = String(level);
      cell.dataset.date = key;
      cell.dataset.count = String(c);
      cell.addEventListener('mouseenter', (e) => showTip(e, key, c));
      cell.addEventListener('mouseleave', hideTip);
      frag.appendChild(cell);
      cur.setDate(cur.getDate() + 1);
    }
    frag.appendChild(document.createElement('br'));
  }
  host.appendChild(frag);

  function showTip(e, date, count) {
    tip.hidden = false;
    tip.textContent = count ? `${date} · ${count} 篇` : `${date} · 0 篇`;
    tip.style.left = (e.clientX + 12) + 'px';
    tip.style.top = (e.clientY + 12) + 'px';
  }
  function hideTip() { tip.hidden = true; }
})();
