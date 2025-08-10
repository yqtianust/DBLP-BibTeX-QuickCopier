// ==UserScript==
// @name         DBLP Copy BibTeX Button
// @namespace    https://github.com/yqtianust
// @version      1.0.0
// @description  Adds a small clipboard icon before DBLP publication titles to copy BibTeX entries to clipboard with one click.
// @author       yqtian
// @match        https://dblp.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      dblp.org
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    console.log('[DBLP Copy] starting');

    function createButton(text) {
        var btn = document.createElement('button');
        btn.textContent = text || 'Copy';
        btn.style.marginRight = '6px';
        btn.style.fontSize = '11px';
        btn.style.padding = '1px 4px';
        btn.style.lineHeight = '1.2';
        btn.style.cursor = 'pointer';
        btn.style.verticalAlign = 'middle';
        btn.style.backgroundColor = '#f5f5f5';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '3px';
        btn.style.color = '#333';
        btn.style.fontFamily = 'sans-serif';
        return btn;
    }

    function extractBibtexFromHtml(html) {
        var m = /<pre[^>]*>([\s\S]*?)<\/pre>/i.exec(html);
        if (m) {
            var container = document.createElement('div');
            container.innerHTML = m[1];
            return (container.textContent || container.innerText || m[1]).trim();
        }
        var stripped = html.replace(/<[^>]+>/g, '');
        if (stripped.trim().startsWith('@')) {
            return stripped.trim();
        }
        return null;
    }

    function addButtons() {
        var entries = document.querySelectorAll('li.entry');
        console.log('[DBLP Copy] Found', entries.length, 'entries');

        entries.forEach(function (entry, idx) {
            if (entry.__copyButtonAdded) {
                return;
            }

            var bibAnchor = entry.querySelector('nav.publ a[title="BibTeX"]') ||
                entry.querySelector('nav.head a[title="BibTeX"]') ||
                Array.from(entry.querySelectorAll('a')).find(function (a) {
                    return /bibtex/i.test(a.textContent || a.title || '');
                });

            if (!bibAnchor) {
                console.warn('[DBLP Copy] No BibTeX link found for entry', idx + 1);
                return;
            }

            var bibUrl = bibAnchor.href;
            var citeEl = entry.querySelector('cite');
            if (!citeEl) {
                console.warn('[DBLP Copy] No title found for entry', idx + 1);
                return;
            }

            var btn = createButton('Bib');

            btn.addEventListener('click', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                btn.disabled = true;
                btn.textContent = 'Fetching...';
                console.log('[DBLP Copy] Fetching BibTeX from', bibUrl);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: bibUrl,
                    onload: function (res) {
                        if (res.status >= 200 && res.status < 300) {
                            var bib = extractBibtexFromHtml(res.responseText || '');
                            if (bib) {
                                GM_setClipboard(bib);
                                console.log('[DBLP Copy] Copied:', bib);
                                btn.textContent = 'Copied!';
                                setTimeout(function () {
                                    btn.textContent = 'Bib';
                                    btn.disabled = false;
                                }, 1400);
                            } else {
                                console.error('[DBLP Copy] Could not extract BibTeX for', bibUrl);
                                alert('Could not extract BibTeX.');
                                btn.textContent = 'Error';
                                btn.disabled = false;
                            }
                        } else {
                            console.error('[DBLP Copy] HTTP error', res.status, bibUrl);
                            alert('Failed to fetch BibTeX (status ' + res.status + ').');
                            btn.textContent = 'Error';
                            btn.disabled = false;
                        }
                    },
                    onerror: function () {
                        console.error('[DBLP Copy] Request error for', bibUrl);
                        alert('Network error fetching BibTeX.');
                        btn.textContent = 'Error';
                        btn.disabled = false;
                    }
                });
            });

            // Insert before the title (<cite>)
            citeEl.parentNode.insertBefore(btn, citeEl);

            entry.__copyButtonAdded = true;
        });
    }

    addButtons();

    // Catch dynamically loaded entries
    var obs = new MutationObserver(function () {
        addButtons();
    });
    obs.observe(document.body, { childList: true, subtree: true });
})();