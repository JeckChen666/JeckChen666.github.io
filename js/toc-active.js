// Lumen — TOC 滚动同步：当前章节对应链接高亮
(() => {
  const tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;
  const headings = Array.from(tocLinks)
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!headings.length) return;

  const setActive = (id) => {
    tocLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  };

  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if (visible.length) {
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActive(visible[0].target.id);
    }
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => io.observe(h));
})();
