# SPA Navigator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformar index.html en un SPA que carga los 173 archivos dinámicamente, con botones de descarga de código en componentes N1–N6.

**Architecture:** El shell (index.html) intercepta clicks del sidebar, hace fetch del HTML, parsea el body, limpia Alpine, inyecta contenido en `<main>`, y ejecuta scripts. Hash routing para deep linking. Un módulo aparte inyecta botones de descarga en las secciones de componentes.

**Tech Stack:** Vanilla JS, Alpine.js 3 (CDN), Tailwind CSS v4

---

### Task 1: Crear spa-router.js — el motor de carga SPA

**Files:**
- Create: `src/js/spa-router.js`

**Step 1: Crear el archivo con la lógica completa del router**

```js
// src/js/spa-router.js
// Motor SPA para LayoutOS — carga HTML dinámicamente en <main>

(function () {
  const main = document.getElementById('spa-content');
  const welcomeScreen = document.getElementById('welcome-screen');
  const navLinks = document.querySelectorAll('#spa-sidebar a[href]');
  let currentPath = null;

  // ── Parsear HTML remoto ──────────────────────────────────
  function parseBody(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Extraer scripts inline (no el CDN de Alpine)
    const scripts = [];
    doc.querySelectorAll('script').forEach(s => {
      if (!s.src && s.textContent.trim()) {
        scripts.push(s.textContent);
      }
    });
    // Extraer styles inline (excepto [x-cloak])
    const styles = [];
    doc.querySelectorAll('style').forEach(s => {
      if (!s.textContent.includes('x-cloak')) {
        styles.push(s.textContent);
      }
    });
    // Extraer contenido del body (sin scripts, sin styles)
    const body = doc.body;
    body.querySelectorAll('script').forEach(s => s.remove());
    body.querySelectorAll('style').forEach(s => s.remove());
    return { html: body.innerHTML, scripts, styles };
  }

  // ── Limpiar Alpine del main ──────────────────────────────
  function cleanupAlpine() {
    if (main._x_dataStack) {
      delete main._x_dataStack;
    }
    // Destruir árboles Alpine dentro del main
    main.querySelectorAll('[x-data]').forEach(el => {
      if (el._x_dataStack) {
        Alpine.destroyTree(el);
      }
    });
    // Limpiar funciones globales registradas por componentes previos
    // (las funciones nombradas se sobreescriben naturalmente)
  }

  // ── Cargar una ruta ──────────────────────────────────────
  async function loadRoute(path) {
    if (path === currentPath) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseBody(text);

      // Limpiar Alpine
      cleanupAlpine();

      // Ocultar welcome, mostrar contenido
      if (welcomeScreen) welcomeScreen.style.display = 'none';
      main.innerHTML = '';

      // Inyectar estilos custom
      if (parsed.styles.length) {
        const styleEl = document.createElement('style');
        styleEl.textContent = parsed.styles.join('\n');
        main.appendChild(styleEl);
      }

      // Inyectar HTML
      const container = document.createElement('div');
      container.innerHTML = parsed.html;
      main.appendChild(container);

      // Ejecutar scripts (funciones nombradas de Alpine)
      parsed.scripts.forEach(code => {
        try {
          const script = document.createElement('script');
          script.textContent = code;
          document.body.appendChild(script);
          document.body.removeChild(script);
        } catch (e) {
          console.warn('Error ejecutando script:', e);
        }
      });

      // Inicializar Alpine en el nuevo contenido
      Alpine.initTree(container);

      // Inyectar botones de descarga si es componente N1-N6
      if (typeof injectDownloadButtons === 'function') {
        injectDownloadButtons(main, path, text);
      }

      // Actualizar estado
      currentPath = path;
      updateActiveLink(path);
      main.scrollTop = 0;

      // Actualizar título
      const h1 = container.querySelector('h1');
      if (h1) {
        document.title = `LayoutOS · ${h1.textContent}`;
      }

    } catch (err) {
      main.innerHTML = `
        <div class="h-full flex items-center justify-center text-center px-6">
          <div class="space-y-3">
            <p class="text-sm text-rose-600 font-medium">Error al cargar</p>
            <p class="text-xs text-zinc-400">${path}</p>
            <a href="${path}" target="_blank" class="btn-secondary text-xs inline-block">Abrir en nueva pestaña</a>
          </div>
        </div>`;
    }
  }

  // ── Active state del sidebar ─────────────────────────────
  function updateActiveLink(path) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === path;
      link.classList.toggle('bg-blue-50', isActive);
      link.classList.toggle('text-blue-600', isActive);
      link.classList.toggle('font-medium', isActive);
      link.classList.toggle('text-zinc-600', !isActive);
    });
  }

  // ── Interceptar clicks del sidebar ───────────────────────
  document.getElementById('spa-sidebar').addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    e.preventDefault();
    const path = link.getAttribute('href');
    window.location.hash = path;
  });

  // ── Hash routing ─────────────────────────────────────────
  function onHashChange() {
    const hash = window.location.hash.slice(1); // quitar #
    if (hash) {
      loadRoute(hash);
      // Scroll sidebar al link activo
      const activeLink = document.querySelector(`#spa-sidebar a[href="${hash}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('hashchange', onHashChange);

  // Cargar ruta inicial si hay hash
  if (window.location.hash) {
    onHashChange();
  }
})();
```

**Step 2: Commit**

```bash
git add src/js/spa-router.js
git commit -m "feat: spa-router.js — motor de carga SPA con hash routing"
```

---

### Task 2: Crear code-download.js — botones de descarga

**Files:**
- Create: `src/js/code-download.js`

**Step 1: Crear el archivo con la lógica de descarga**

```js
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
```

**Step 2: Commit**

```bash
git add src/js/code-download.js
git commit -m "feat: code-download.js — descarga de componente completo y por variante"
```

---

### Task 3: Modificar index.html — integrar SPA shell

**Files:**
- Modify: `index.html`

**Step 1: Cambios al index.html**

Cambios necesarios:

1. **Agregar `id="spa-sidebar"` al `<nav>`** del sidebar (línea ~26)
2. **Agregar `id="spa-content"` al `<main>`** (línea ~329)
3. **Agregar `id="welcome-screen"` al div de bienvenida** (línea ~331)
4. **Mover Alpine CDN ANTES de los scripts custom** (para que `Alpine` esté disponible)
5. **Agregar los scripts** `spa-router.js` y `code-download.js` al final del body
6. **Cambiar el `<main>` para que sea overflow-y-auto** en vez de overflow-hidden
7. **Agregar link "Design Tokens" al nav-home** para que cargue algo al inicio

Modificaciones puntuales:

- En `<nav>` (~línea 26): agregar `id="spa-sidebar"`
- En `<main>` (~línea 329): cambiar a `<main id="spa-content" class="flex-1 overflow-y-auto bg-zinc-50">`
- En el div de welcome (~línea 331): agregar `id="welcome-screen"`
- Antes de `</body>`: agregar los 2 scripts (code-download.js ANTES de spa-router.js, ya que router llama a `injectDownloadButtons`)
- El Alpine CDN debe cargarse SIN `defer` para que esté disponible cuando el router lo necesite, o cargarlo antes y usar `Alpine.start()` manualmente

**Step 2: Verificar que funciona**

Run: `npm run dev` y navegar en el browser. Clicks en sidebar deben cargar contenido dinámicamente. URL debe cambiar con hash. Back/forward del browser debe funcionar.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: index.html como SPA shell — integra router y descarga"
```

---

### Task 4: Build CSS y commit final

**Step 1: Rebuild Tailwind**

```bash
npx @tailwindcss/cli -i ./src/css/main.css -o ./public/css/main.css --minify
```

**Step 2: Verificación manual**

- [ ] Abrir index.html en browser
- [ ] Click en C01 del sidebar → carga componente sin reload
- [ ] URL muestra `#/src/components/n1-fundamentos/C01-banners.html`
- [ ] Click en C47 → carga, Alpine funciona (sorts, filters)
- [ ] Back button → vuelve a C01
- [ ] Click en P13 → carga página con su propio sidebar interno
- [ ] Botón "Descargar componente" aparece en C01-C101 (no en C102-C107, no en páginas)
- [ ] Botón "Copiar variante" aparece en cada sección de componentes N1-N6
- [ ] Descarga genera archivo HTML válido
- [ ] Refresh de página con hash → carga el componente correcto

**Step 3: Commit final**

```bash
git add -A
git commit -m "feat: SPA navigator completo — routing, descarga de código, deep linking"
```
