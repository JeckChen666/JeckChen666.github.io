// Lumen — 鼠标交互粒子背景（基于 tsParticles）
// 启动时从 CSS var --accent 读取颜色；
// 主题色变化时（lumen:theme-change 事件）销毁并重新加载以联动颜色。
(() => {
  if (!window.tsParticles) return;

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF6700';
  }

  function buildConfig(accent) {
    return {
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: 'transparent' } },
      particles: {
        number: { value: 90, density: { enable: true, area: 900 } },
        color: { value: accent },
        shape: { type: 'circle' },
        opacity: {
          value: 0.6,
          random: true,
          animation: { enable: true, speed: 1, opacity_min: 0.15, sync: false }
        },
        size: { value: { min: 1, max: 3 }, random: true },
        links: {
          enable: true,
          distance: 150,
          color: accent,
          opacity: 0.25,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          onClick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.5 } },
          push: { quantity: 3 }
        }
      }
    };
  }

  async function loadParticles() {
    if (typeof window.tsParticles.load === 'undefined') return;
    try {
      await window.tsParticles.load({ id: 'lumen-particles', options: buildConfig(getAccent()) });
    } catch (e) { /* 静默失败：粒子是装饰，不影响主流程 */ }
  }

  // 首次加载
  loadParticles();

  // 主题色切换时重新加载
  window.addEventListener('lumen:theme-change', () => {
    setTimeout(async () => {
      try {
        if (window.tsParticles && window.tsParticles.domItem) {
          // 销毁旧实例
          const container = document.getElementById('lumen-particles');
          if (container) await window.tsParticles.domItem(0);  // 不一定有 domItem
        }
      } catch (e) {}
      // 简化：直接重新 load
      try {
        const container = document.getElementById('lumen-particles');
        if (container) container.innerHTML = '';
      } catch (e) {}
      loadParticles();
    }, 100);
  });
})();