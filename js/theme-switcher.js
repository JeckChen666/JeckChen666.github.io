// Lumen — 主题色切换（8 套预设 + 自定义 hex）
(() => {
  const KEYS = {
    accent:   'lumen:accent',
  };

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }
  function rgba(rgb, a) { return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`; }

  function applyAccent(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const root = document.documentElement.style;
    root.setProperty('--accent', hex);
    root.setProperty('--accent-30', rgba(rgb, 0.30));
    root.setProperty('--accent-60', rgba(rgb, 0.60));
    return true;
  }

  // 启动时恢复
  const saved = localStorage.getItem(KEYS.accent);
  if (saved) applyAccent(saved);

  // 选中态初始化（高亮当前色对应的预设）
  if (saved) {
    const target = document.querySelector(`.theme-panel__swatch[data-value="${saved}"]`);
    if (target) target.classList.add('is-active');
  }

  const panel = document.getElementById('theme-panel');
  if (!panel) return;
  function openPanel()  { panel.hidden = false; }
  function closePanel() { panel.hidden = true; }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;
    if (action === 'open-theme')  { e.preventDefault(); openPanel(); }
    if (action === 'close-theme') { closePanel(); }
    if (action === 'set-accent') {
      if (applyAccent(t.dataset.value)) {
        localStorage.setItem(KEYS.accent, t.dataset.value);
        panel.querySelectorAll('.theme-panel__swatch').forEach(s => s.classList.remove('is-active'));
        t.classList.add('is-active');
        window.dispatchEvent(new CustomEvent('lumen:theme-change', { detail: t.dataset.value }));
      }
    }
  });

  // 自定义颜色
  const input = document.getElementById('theme-custom-color');
  if (input) {
    input.addEventListener('change', () => {
      const v = input.value.trim();
      if (applyAccent(v)) {
        localStorage.setItem(KEYS.accent, v);
        panel.querySelectorAll('.theme-panel__swatch').forEach(s => s.classList.remove('is-active'));
        window.dispatchEvent(new CustomEvent('lumen:theme-change', { detail: v }));
      } else {
        input.value = '';
      }
    });
  }

  // 点击面板外关闭
  document.addEventListener('click', (e) => {
    if (panel.hidden) return;
    if (!panel.contains(e.target) && !e.target.closest('[data-action="open-theme"]')) {
      closePanel();
    }
  });
})();
