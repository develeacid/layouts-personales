// src/js/code-download.js
// Inyecta botones de descarga en componentes N1-N6

function injectDownloadButtons(container, filePath, rawHtml) {
  // Solo componentes N1-N6
  const isComponent = /\/src\/components\/n[1-6]-/.test(filePath);
  if (!isComponent) return;

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
    btn.addEventListener('click', () => {
      downloadFile(`${fileName}.html`, rawHtml);
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
    btn.addEventListener('click', () => {
      const variantHtml = buildVariantFile(section, container, fileName, i + 1);
      downloadFile(`${fileName}-variante-${i + 1}.html`, variantHtml);
    });
    section.appendChild(btn);
  });
}

// ── Construir archivo standalone de una variante ─────────
function buildVariantFile(section, container, fileName, variantNum) {
  // Recoger scripts inline del contenedor
  const scripts = [];
  container.querySelectorAll('script').forEach(s => {
    if (s.textContent.trim()) scripts.push(s.textContent);
  });

  // Recoger styles custom
  const styles = [];
  container.querySelectorAll('style').forEach(s => {
    styles.push(s.textContent);
  });

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
  <link rel="stylesheet" href="/public/css/main.css" />
</head>
<body class="h-full bg-page antialiased">
  <div class="max-w-5xl mx-auto px-6 py-16">
    ${clone.outerHTML}
  </div>
  <style>[x-cloak] { display: none !important; }</style>
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
