import { useEffect } from 'react';

export function useCodeHighlight(contentSelector = '.prose-dark') {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { default: hljs } = await import('highlight.js');
      if (cancelled) return;

      document.querySelectorAll<HTMLElement>(`${contentSelector} pre code`).forEach((codeEl) => {
        if (codeEl.closest('.code-wrapper')) return;

        hljs.highlightElement(codeEl);

        const pre = codeEl.parentElement!;
        const lang = (codeEl.className.match(/language-(\w+)/) || [])[1] || '';

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode!.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const header = document.createElement('div');
        header.className = 'code-header';
        wrapper.insertBefore(header, pre);

        const dots = document.createElement('div');
        dots.className = 'code-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(dots);

        if (lang) {
          const label = document.createElement('span');
          label.className = 'code-lang';
          label.textContent = lang;
          header.appendChild(label);
        }

        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>`;
        header.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeEl.innerText);
            const span = copyBtn.querySelector('span')!;
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✓ Copied!</span>';
            copyBtn.classList.add('copied');
            setTimeout(() => {
              copyBtn.innerHTML = originalHTML;
              copyBtn.classList.remove('copied');
            }, 2000);
          } catch {}
        });
      });
    })();

    return () => { cancelled = true; };
  }, []);
}
