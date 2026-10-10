// Lumen — 给 .post-body pre 包一层 .code-block，加语言标签 + 复制按钮
(() => {
  document.querySelectorAll('.post-body pre').forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
    const code = pre.querySelector('code');
    const lang = (code && code.className.match(/language-([\w-]+)/) || [,'code'])[1];

    const wrap = document.createElement('div');
    wrap.className = 'code-block';

    const header = document.createElement('div');
    header.className = 'code-block__header';
    const langSpan = document.createElement('span');
    langSpan.className = 'code-block__lang';
    langSpan.textContent = lang;
    header.appendChild(langSpan);

    const btn = document.createElement('button');
    btn.className = 'code-block__copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText((code && code.innerText) || pre.innerText);
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1500);
      } catch (e) {
        btn.textContent = 'Err';
      }
    });
    header.appendChild(btn);

    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(header);
    wrap.appendChild(pre);
  });
})();
