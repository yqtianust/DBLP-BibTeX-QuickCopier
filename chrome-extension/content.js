(function () {
  'use strict';

  function createButton() {
    const btn = document.createElement('button');
    btn.textContent = '📋';
    btn.title = 'Copy BibTeX';
    btn.style.marginRight = '4px';
    btn.style.fontSize = '12px';
    btn.style.padding = '0 2px';
    btn.style.lineHeight = '1';
    btn.style.cursor = 'pointer';
    btn.style.verticalAlign = 'middle';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.color = '#555';
    btn.style.fontFamily = 'sans-serif';
    btn.style.opacity = '0.7';
    btn.addEventListener('mouseover', () => {
      btn.style.opacity = '1';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.opacity = '0.7';
    });
    return btn;
  }

  function extractBibtexFromHtml(html) {
    const match = /<pre[^>]*>([\s\S]*?)<\/pre>/i.exec(html);
    if (match) {
      const container = document.createElement('div');
      container.innerHTML = match[1];
      return (container.textContent || container.innerText || match[1]).trim();
    }
    // fallback: strip HTML tags and check for BibTeX entry
    const stripped = html.replace(/<[^>]+>/g, '');
    if (stripped.trim().startsWith('@')) {
      return stripped.trim();
    }
    return null;
  }

  async function fetchBibtex(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const text = await response.text();
    return extractBibtexFromHtml(text);
  }

  function addButtons() {
    const entries = document.querySelectorAll('li.entry');
    entries.forEach(entry => {
      if (entry.__copyButtonAdded) return;

      // Find BibTeX link inside this entry
      const bibAnchor =
        entry.querySelector('nav.publ a[title="BibTeX"]') ||
        entry.querySelector('nav.head a[title="BibTeX"]') ||
        Array.from(entry.querySelectorAll('a')).find(a =>
          /bibtex/i.test(a.textContent || a.title || '')
        );

      if (!bibAnchor) return;

      const bibUrl = bibAnchor.href;
      const citeEl = entry.querySelector('cite');
      if (!citeEl) return;

      const btn = createButton();

      btn.addEventListener('click', async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        btn.disabled = true;
        btn.textContent = '⌛';

        try {
          const bib = await fetchBibtex(bibUrl);
          if (bib) {
            await navigator.clipboard.writeText(bib);
            btn.textContent = '📋';
          } else {
            alert('Could not extract BibTeX.');
            btn.textContent = '❌';
          }
        } catch (err) {
          alert('Error fetching BibTeX: ' + err.message);
          btn.textContent = '❌';
        } finally {
          btn.disabled = false;
        }
      });

      citeEl.parentNode.insertBefore(btn, citeEl);
      entry.__copyButtonAdded = true;
    });
  }

  addButtons();

  // Observe for dynamically added entries
  const observer = new MutationObserver(() => addButtons());
  observer.observe(document.body, { childList: true, subtree: true });
})();