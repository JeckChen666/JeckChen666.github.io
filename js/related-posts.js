// Lumen — 相关阅读推荐（按 tag 命中数排序）
(() => {
  const listEl = document.getElementById('related-posts-list');
  if (!listEl) return;

  const currentTags = (window.__POST_TAGS__ || []).map(t => String(t).toLowerCase());
  const allPosts = window.__SITE_POSTS__ || [];
  const currentPath = window.__POST_PATH__ || location.pathname;

  const scored = allPosts
    .filter(p => p.path !== currentPath)
    .map(p => ({
      post: p,
      score: (p.tags || []).filter(t => currentTags.includes(String(t).toLowerCase())).length
    }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (!scored.length) {
    listEl.innerHTML = '<p class="related-posts__empty">暂无相关文章</p>';
    return;
  }

  listEl.innerHTML = scored.map(({ post: p }) => `
    <a class="related-posts__item" href="${p.path}">
      <div class="related-posts__name">${escapeHtml(p.title)}</div>
      <div class="related-posts__date">${p.date}</div>
    </a>
  `).join('');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
})();
