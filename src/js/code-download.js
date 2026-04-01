// src/js/code-download.js
// Inyecta botones de descarga y copia en componentes y páginas

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
  const isPage = /\/src\/pages\//.test(filePath);
  if (!isComponent && !isPage) return;

  // Pre-cargar CSS en background
  getCssContent();

  // Guardar scripts/styles parseados del HTML original (no están en el DOM del container)
  const _parsedScripts = parsedScripts || [];
  const _parsedStyles = parsedStyles || [];
  const _parsedCdns = parsedCdns || [];

  const fileName = filePath.split('/').pop().replace('.html', '');

  // ── Botones de componente completo ─────────────────────
  const header = container.querySelector('header');
  if (header) {
    // Botón descargar
    const dlHtml = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Descargar componente`;
    const dlBtn = document.createElement('button');
    dlBtn.className = 'btn-secondary btn-sm mt-3 inline-flex items-center gap-1.5';
    dlBtn.innerHTML = dlHtml;
    dlBtn.addEventListener('click', async () => {
      const css = await getCssContent();
      const standalone = makeStandalone(rawHtml, css);
      downloadFile(`${fileName}.html`, standalone);
      showFeedback(dlBtn, dlHtml, '¡Descargado!');
    });
    header.appendChild(dlBtn);

    // Botón copiar HTML
    const copyHtml = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
      Copiar HTML`;
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-secondary btn-sm mt-3 ml-2 inline-flex items-center gap-1.5';
    copyBtn.innerHTML = copyHtml;
    copyBtn.addEventListener('click', () => {
      const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
      doc.body.querySelectorAll('script').forEach(s => s.remove());
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
      navigator.clipboard.writeText(doc.body.innerHTML.trim());
      showFeedback(copyBtn, copyHtml, '¡Copiado!');
    });
    header.appendChild(copyBtn);
  }

  // ── Botones por variante (solo componentes) ────────────
  if (isComponent) {
    const sections = container.querySelectorAll('section');
    sections.forEach((section, i) => {
      section.style.position = 'relative';

      const wrapper = document.createElement('div');
      wrapper.className = 'absolute top-0 right-0 flex items-center gap-1';

      // Botón copiar HTML de variante
      const copyVHtml = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        <span class="text-xs">Copiar</span>`;
      const copyVBtn = document.createElement('button');
      copyVBtn.className = 'btn-ghost btn-sm text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1';
      copyVBtn.innerHTML = copyVHtml;
      copyVBtn.addEventListener('click', () => {
        const clone = section.cloneNode(true);
        const btns = clone.querySelector('.absolute.top-0.right-0');
        if (btns) btns.remove();
        clone.style.position = '';
        navigator.clipboard.writeText(clone.outerHTML);
        showFeedback(copyVBtn, copyVHtml, '¡Copiado!');
      });

      // Botón descargar variante standalone
      const dlVHtml = `
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span class="text-xs">Descargar</span>`;
      const dlVBtn = document.createElement('button');
      dlVBtn.className = 'btn-ghost btn-sm text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1';
      dlVBtn.innerHTML = dlVHtml;
      dlVBtn.addEventListener('click', async () => {
        const css = await getCssContent();
        const variantHtml = buildVariantFile(section, fileName, i + 1, css, _parsedScripts, _parsedStyles, _parsedCdns);
        downloadFile(`${fileName}-variante-${i + 1}.html`, variantHtml);
        showFeedback(dlVBtn, dlVHtml, '¡Descargado!');
      });

      wrapper.appendChild(copyVBtn);
      wrapper.appendChild(dlVBtn);
      section.appendChild(wrapper);
    });
  }
}

// ── Hacer HTML de componente completo standalone ─────────
function makeStandalone(html, css) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/css\/main\.css"\s*\/?>/,
    `<style>${css}</style>`
  );
}

// ── Construir archivo standalone de una variante ─────────
function buildVariantFile(section, fileName, variantNum, css, scripts, styles, cdns) {
  const clone = section.cloneNode(true);
  const dlBtn = clone.querySelector('.absolute.top-0.right-0');
  if (dlBtn) dlBtn.remove();
  clone.style.position = '';

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

// ── Feedback visual en botones ───────────────────────────
function showFeedback(btn, originalHtml, message) {
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
    <span class="text-xs text-emerald-600">${message}</span>`;
  setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
}
