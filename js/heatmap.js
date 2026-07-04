// Lumen — 写作热力图（最近 365 天，GitHub 风格：7 行 × ~52 列）
//  行 = 周日 ~ 周六（7 行），列 = 每周（横向排列）
//  包含月份标签、星期标签、颜色图例
(() => {
  const host = document.getElementById('heatmap');
  if (!host) return;
  const tip = document.getElementById('heatmap-tooltip');

  // 按日期聚合文章计数
  const posts = window.__SITE_POSTS__ || [];
  const counts = {};
  posts.forEach(p => {
    const d = (p.date || '').slice(0, 10);
    if (d) counts[d] = (counts[d] || 0) + 1;
  });

  // 计算起始日期：365 天前，对齐到周日（和 GitHub 保持一致）
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  const startDow = start.getDay();
  start.setDate(start.getDate() - startDow);

  // 总天数和总周数
  const msPerDay = 86400000;
  const totalDays = Math.floor((today - start) / msPerDay) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  // 每个单元格占用的宽度（12px 格 + 2px margin）
  const CELL_SIZE = 14;

  // ============================================================
  // 1. 构建月份标签
  // ============================================================
  const monthNames = ['1月','2月','3月','4月','5月','6月',
                      '7月','8月','9月','10月','11月','12月'];
  const monthsRow = document.createElement('div');
  monthsRow.className = 'heatmap__months';

  for (let w = 0; w < totalWeeks; ) {
    // 取每周中间那天来判断属于哪个月份
    const d = new Date(start);
    d.setDate(d.getDate() + w * 7 + 3);
    const currentMonth = d.getMonth();

    // 计算该月份跨越几周
    let span = 0;
    while (w + span < totalWeeks) {
      const check = new Date(start);
      check.setDate(check.getDate() + (w + span) * 7 + 3);
      if (check.getMonth() !== currentMonth) break;
      span++;
    }

    const label = document.createElement('span');
    label.className = 'heatmap__month';
    label.textContent = monthNames[currentMonth];
    label.style.width = (span * CELL_SIZE) + 'px';
    monthsRow.appendChild(label);
    w += span;
  }

  // ============================================================
  // 2. 构建星期标签（左侧列）
  // ============================================================
  const daysCol = document.createElement('div');
  daysCol.className = 'heatmap__days';
  // GitHub 风格：只显示 Mon / Wed / Fri
  const dayLabels = ['', '一', '', '三', '', '五', ''];
  dayLabels.forEach(label => {
    const span = document.createElement('span');
    span.textContent = label;
    daysCol.appendChild(span);
  });

  // ============================================================
  // 3. 构建格子矩阵（7 行 × totalWeeks 列）
  // ============================================================
  const cellsContainer = document.createElement('div');
  cellsContainer.className = 'heatmap__cells';

  const frag = document.createDocumentFragment();
  for (let dow = 0; dow < 7; dow++) {
    for (let w = 0; w < totalWeeks; w++) {
      const idx = w * 7 + dow;
      const d = new Date(start);
      d.setDate(d.getDate() + idx);

      // 未来的日期 → 隐藏占位
      if (d > today) {
        const span = document.createElement('span');
        span.className = 'heatmap__cell heatmap__cell--empty';
        frag.appendChild(span);
        continue;
      }

      const key = d.toISOString().slice(0, 10);
      const c = counts[key] || 0;
      const level = c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : 3;

      const cell = document.createElement('span');
      cell.className = 'heatmap__cell';
      cell.dataset.level = String(level);
      cell.dataset.date = key;
      cell.dataset.count = String(c);
      cell.addEventListener('mouseenter', () => showTip(cell, key, c));
      cell.addEventListener('mouseleave', hideTip);
      frag.appendChild(cell);
    }
    frag.appendChild(document.createElement('br'));
  }
  cellsContainer.appendChild(frag);

  // ============================================================
  // 4. 构建颜色图例
  // ============================================================
  const legend = document.createElement('div');
  legend.className = 'heatmap__legend';
  legend.innerHTML =
    '<span class="heatmap__legend-label">少</span>' +
    '<span class="heatmap__cell" data-level="0"></span>' +
    '<span class="heatmap__cell" data-level="1"></span>' +
    '<span class="heatmap__cell" data-level="2"></span>' +
    '<span class="heatmap__cell" data-level="3"></span>' +
    '<span class="heatmap__legend-label">多</span>';

  // ============================================================
  // 5. 组装 DOM
  // ============================================================
  // 主区域：星期列 + (月份行 + 格子)
  const mainRow = document.createElement('div');
  mainRow.className = 'heatmap__main-row';

  const cellArea = document.createElement('div');
  cellArea.className = 'heatmap__cell-area';
  cellArea.appendChild(monthsRow);
  cellArea.appendChild(cellsContainer);

  mainRow.appendChild(daysCol);
  mainRow.appendChild(cellArea);

  host.appendChild(mainRow);
  host.appendChild(legend);

  // ============================================================
  // Tooltip 处理
  // ============================================================
  function showTip(el, date, count) {
    tip.hidden = false;
    tip.textContent = count ? `${date} · ${count} 篇` : `${date} · 0 篇`;
    // 跟随鼠标，在格子上方显示
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 8;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
    tip.style.transform = 'translate(-50%, -100%)';
  }
  function hideTip() { tip.hidden = true; }
})();
