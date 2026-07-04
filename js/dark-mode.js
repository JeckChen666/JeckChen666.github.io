// Lumen — 暗色模式切换（同步加载在 <head> 内避免 FOUC）
(() => {
  const KEY = 'lumen:dark';

  function setDark(on) {
    document.documentElement.classList.toggle('dark-mode', on);
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch(e){}
    const btn = document.querySelector('[data-action="toggle-dark"]');
    if (btn) {
      const icon = btn.querySelector('.icon');
      if (icon) icon.className = on ? 'icon icon-moon' : 'icon icon-sun';
      btn.setAttribute('aria-label', on ? '切换浅色' : '切换深色');
    }
  }

  // 启动 — 读 localStorage，否则跟随系统
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === '1') {
      setDark(true);
    } else if (saved === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
    } else {
      setDark(false);
    }
  } catch(e) { setDark(false); }

  // 切换按钮
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action="toggle-dark"]');
    if (!t) return;
    setDark(!document.documentElement.classList.contains('dark-mode'));
  });

  // 系统偏好变化（仅当用户未手动设置）
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(KEY) !== null) return;
      setDark(e.matches);
    });
  } catch(e) {}
})();
