// src/js/code-download.js
// Inyecta barra de herramientas de descarga/copia en componentes y páginas

// ── Cache del CSS para archivos standalone ───────────────
let _cssCache = null;
async function getCssContent() {
  if (_cssCache) return _cssCache;
  try {
    const res = await fetch('/public/css/main.css');
    if (res.ok) _cssCache = await res.text();
  } catch (e) {
    console.warn('No se pudo cargar CSS para descarga:', e);
  }
  return _cssCache || '';
}

function injectDownloadButtons(container, filePath, rawHtml, parsedScripts, parsedStyles, parsedCdns) {
  const isComponent = /\/src\/components\/n[1-8]-/.test(filePath);
  const isPage = /\/src\/pages\/n[2-7]-/.test(filePath);
  if (!isComponent && !isPage) return;

  getCssContent();

  const _parsedScripts = parsedScripts || [];
  const _parsedStyles = parsedStyles || [];
  const _parsedCdns = parsedCdns || [];
  const fileName = filePath.split('/').pop().replace('.html', '');

  // ── Barra fija entre main y footer ─────────────────────
  const toolbar = document.getElementById('download-toolbar');
  if (!toolbar) return;
  toolbar.className = 'shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 py-2';
  toolbar.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <svg class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
        <span class="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">${fileName}.html</span>
      </div>
      <div class="flex items-center gap-2 shrink-0" id="toolbar-actions"></div>
    </div>`;

  const actions = toolbar.querySelector('#toolbar-actions');

  // Botón copiar HTML
  const copyHtml = `
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
    <span class="hidden sm:inline">Copiar HTML</span>`;
  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn-ghost btn-sm inline-flex items-center gap-1.5 text-xs';
  copyBtn.innerHTML = copyHtml;
  copyBtn.addEventListener('click', () => {
    const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
    doc.body.querySelectorAll('script').forEach(s => s.remove());
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
    navigator.clipboard.writeText(doc.body.innerHTML.trim());
    showFeedback(copyBtn, copyHtml, '¡Copiado!');
  });
  actions.appendChild(copyBtn);

  // Botón descargar
  const dlHtml = `
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    <span class="hidden sm:inline">Descargar</span>`;
  const dlBtn = document.createElement('button');
  dlBtn.className = 'btn-primary btn-sm inline-flex items-center gap-1.5 text-xs';
  dlBtn.innerHTML = dlHtml;
  dlBtn.addEventListener('click', async () => {
    const css = await getCssContent();
    const standalone = makeStandalone(rawHtml, css);
    downloadFile(`${fileName}.html`, standalone);
    showFeedback(dlBtn, dlHtml, '¡Descargado!');
  });
  actions.appendChild(dlBtn);

  // La toolbar ya existe en el DOM (index.html), solo la mostramos

  // ── Botones por variante (solo componentes con sections) ──
  if (isComponent) {
    const sections = container.querySelectorAll('section');
    sections.forEach((section, i) => {
      const copyVHtml = `
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>`;

      const copyVBtn = document.createElement('button');
      copyVBtn.className = 'opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer';
      copyVBtn.title = 'Copiar variante';
      copyVBtn.innerHTML = copyVHtml;
      copyVBtn.addEventListener('click', () => {
        const clone = section.cloneNode(true);
        clone.querySelectorAll('[title="Copiar variante"]').forEach(b => b.remove());
        navigator.clipboard.writeText(clone.innerHTML.trim());
        showFeedback(copyVBtn, copyVHtml, '✓');
      });

      section.classList.add('group');
      const h2 = section.querySelector('h2');
      if (h2) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center gap-2';
        h2.parentNode.insertBefore(wrapper, h2);
        wrapper.appendChild(h2);
        wrapper.appendChild(copyVBtn);
      }
    });
  }
}

// ── Hacer HTML standalone ───────────────────────────────
function makeStandalone(html, css) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/css\/main\.css"\s*\/?>/,
    `<style>${css}</style>`
  );
}

// ── Construir variante standalone ───────────────────────
function buildVariantFile(section, fileName, variantNum, css, scripts, styles, cdns) {
  const clone = section.cloneNode(true);
  clone.querySelectorAll('[title="Copiar variante"]').forEach(b => b.remove());
  const title = clone.querySelector('h2')?.textContent || `Variante ${variantNum}`;

  return `<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LayoutOS · ${fileName} — ${title}</title>
  <style>${css}</style>
${styles.length ? `  <style>${styles.join('\n')}</style>` : ''}
</head>
<body class="h-full bg-page antialiased">
  <div class="max-w-5xl mx-auto px-6 py-16">
    ${clone.outerHTML}
  </div>
  <style>[x-cloak] { display: none !important; }</style>
${(cdns || []).map(url => `  <script src="${url}"></script>`).join('\n')}
${scripts.map(s => `  <script>${s}</script>`).join('\n')}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>`;
}

// ── Trigger descarga ─────────────────────────────────────
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Feedback visual ─────────────────────────────────────
function showFeedback(btn, originalHtml, message) {
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
    <span class="text-xs text-emerald-600">${message}</span>`;
  setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
}
