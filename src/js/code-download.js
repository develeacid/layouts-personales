// src/js/code-download.js
// Inyecta botones de descarga en componentes N1-N6

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
  // Solo componentes N1-N6
  const isComponent = /\/src\/components\/n[1-8]-/.test(filePath);
  if (!isComponent) return;

  // Pre-cargar CSS en background
  getCssContent();

  // Guardar scripts/styles parseados del HTML original (no están en el DOM del container)
  const _parsedScripts = parsedScripts || [];
  const _parsedStyles = parsedStyles || [];
  const _parsedCdns = parsedCdns || [];

  const fileName = filePath.split('/').pop().replace('.html', '');

  // ── Botón de componente completo ───────────────────────
  const header = container.querySelector('header');
  if (header) {
    const btn = document.createElement('button');
    btn.className = 'btn-secondary btn-sm mt-3 inline-flex items-center gap-1.5';
    btn.innerHTML = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Descargar componente
    `;
    btn.addEventListener('click', async () => {
      const css = await getCssContent();
      const standalone = makeStandalone(rawHtml, css);
      downloadFile(`${fileName}.html`, standalone);
    });
    header.appendChild(btn);
  }

  // ── Botón por variante (cada <section>) ────────────────
  const sections = container.querySelectorAll('section');
  sections.forEach((section, i) => {
    section.style.position = 'relative';

    const btn = document.createElement('button');
    btn.className = 'absolute top-0 right-0 btn-ghost btn-sm text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1';
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span class="text-xs">Copiar variante</span>
    `;
    btn.addEventListener('click', async () => {
      const css = await getCssContent();
      const variantHtml = buildVariantFile(section, fileName, i + 1, css, _parsedScripts, _parsedStyles, _parsedCdns);
      downloadFile(`${fileName}-variante-${i + 1}.html`, variantHtml);
    });
    section.appendChild(btn);
  });
}

// ── Hacer HTML de componente completo standalone ─────────
function makeStandalone(html, css) {
  // Reemplazar <link rel="stylesheet" href="/public/css/main.css" /> por <style> inline
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/css\/main\.css"\s*\/?>/,
    `<style>${css}</style>`
  );
}

// ── Construir archivo standalone de una variante ─────────
function buildVariantFile(section, fileName, variantNum, css, scripts, styles, cdns) {
  // Clonar sección limpiando el botón de descarga
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
