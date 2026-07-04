// Lumen — 顶栏滚动模糊
// 监听 window.scroll，超过 50px 后给顶栏加 is-scrolled 类
(() => {
  const header = document.getElementById('lumen-header');
  if (!header) return;

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 50;
      header.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();  // 初始检查（例如锚点直接落在页面中段）
})();
