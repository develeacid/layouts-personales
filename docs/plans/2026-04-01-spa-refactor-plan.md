# SPA Refactor — Plan de Implementación

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimizar la SPA de LayoutOS: eliminar código muerto, extraer welcome screen, agregar caché+prefetch al router, y mejorar el sistema de descargas con copiar al clipboard.

**Architecture:** Refactorización interna en 4 fases secuenciales. Cada fase produce un commit atómico funcional. No se agrega tooling nuevo. El proyecto es HTML estático + Alpine.js + Tailwind CSS sin framework de tests.

**Tech Stack:** HTML5, Alpine.js 3 (CDN), Tailwind CSS v4, Vanilla JS

**Design doc:** `docs/plans/2026-04-01-spa-refactor-design.md`

**Auditoría previa de `<section>` (prerequisito resuelto):**
- 110/117 componentes usan `<section>` (94%)
- 7 componentes sin `<section>`: C16, C33, C35, C38, C39, C42, C46
- Las páginas no usan `<section>` (solo 2/66) — confirma decisión de no poner botones de variante en páginas

---

## Task 1: Eliminar archivos muertos

**Files:**
- Delete: `src/js/alpine-stores.js`
- Delete: `src/js/utils.js`

**Step 1: Eliminar archivos**

```bash
rm src/js/alpine-stores.js src/js/utils.js
```

**Step 2: Verificar que no se rompe nada**

Confirmar que ningún `<script src=` en `index.html` ni en `spa-router.js` referencia estos archivos. Ya verificado: no se cargan en `index.html` y el router no los importa.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove unused alpine-stores.js and utils.js"
```

---

## Task 2: Fixes rápidos en code-download.js

**Files:**
- Modify: `src/js/code-download.js:2` — fix comentario
- Modify: `src/js/code-download.js:62` — fix label botón

**Step 1: Fix comentario línea 2**

Cambiar:
```js
// Inyecta botones de descarga en componentes N1-N6
```
Por:
```js
// Inyecta botones de descarga en componentes N1-N8
```

**Step 2: Fix label botón línea 62**

Cambiar:
```html
<span class="text-xs">Copiar variante</span>
```
Por:
```html
<span class="text-xs">Descargar variante</span>
```

**Step 3: Commit**

```bash
git add src/js/code-download.js && git commit -m "fix: correct comment and button label in code-download.js"
```

---

## Task 3: Conteos dinámicos en sidebar

**Files:**
- Modify: `src/js/sidebar-data.js` — agregar getters computados
- Modify: `index.html:134` — usar binding dinámico

**Step 1: Agregar getters en sidebar-data.js**

Dentro de `Alpine.data('sidebar', () => ({`, después de la propiedad `darkMode`, agregar:

```js
get componentCount() {
  return this.sections.filter(s => s.type === 'component')
    .reduce((a, s) => a + s.items.length, 0);
},
get pageCount() {
  return this.sections.filter(s => s.type === 'page')
    .reduce((a, s) => a + s.items.length, 0);
},
```

**Step 2: Cambiar binding en index.html**

Línea 134, cambiar:
```html
<p class="text-[11px]" :class="darkMode ? 'text-zinc-600' : 'text-zinc-400'">107 componentes · 66 paginas</p>
```
Por:
```html
<p class="text-[11px]" :class="darkMode ? 'text-zinc-600' : 'text-zinc-400'" x-text="componentCount + ' componentes · ' + pageCount + ' páginas'"></p>
```

**Step 3: Verificar en navegador**

Abrir `http://localhost:3000` y confirmar que el footer del sidebar muestra "117 componentes · 66 páginas".

**Step 4: Commit**

```bash
git add src/js/sidebar-data.js index.html && git commit -m "fix: dynamic component/page counts in sidebar footer"
```

---

## Task 4: Eliminar función muerta updateActiveLink

**Files:**
- Modify: `src/js/spa-router.js:135` — eliminar invocación
- Modify: `src/js/spa-router.js:156-161` — eliminar función

**Step 1: Eliminar invocación en línea 135**

Eliminar la línea:
```js
      updateActiveLink(path);
```

**Step 2: Eliminar función en líneas 156-161**

Eliminar:
```js
  // ── Active state del sidebar ─────────────────────────────
  // Active state is now managed by Alpine's :class binding.
  // This function is kept as a no-op for compatibility.
  function updateActiveLink(path) {
    // No-op: Alpine handles active styling via currentPath
  }
```

**Step 3: Commit**

```bash
git add src/js/spa-router.js && git commit -m "chore: remove dead updateActiveLink no-op function"
```

---

## Task 5: Extraer welcome screen a archivo separado

**Files:**
- Create: `src/pages/welcome.html`
- Modify: `index.html` — eliminar welcome inline, dejar main vacío
- Modify: `src/js/spa-router.js` — cargar welcome como ruta default

**Step 1: Crear src/pages/welcome.html**

Copiar el contenido del `<div id="welcome-screen">` (index.html líneas 178-416) a un archivo standalone con la estructura estándar de componente LayoutOS:

```html
<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LayoutOS · Bienvenida</title>
  <link rel="stylesheet" href="/public/css/main.css" />
</head>
<body class="h-full bg-page antialiased">

  <!-- Pegar aquí todo el contenido interno del div#welcome-screen -->
  <!-- Desde <div class="px-6 py-12 ..."> hasta su cierre -->
  <!-- El x-data="{ activeLevel: null }" del roadmap debe mantenerse -->

  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
```

Actualizar los conteos hardcodeados en el welcome (cambiar 107→117 componentes).

**Step 2: Simplificar index.html**

Eliminar todo el bloque `<div id="welcome-screen">...</div>` (líneas 178-416). El `<main>` queda:

```html
<main id="spa-content" class="flex-1 overflow-y-auto bg-zinc-50"></main>
```

**Step 3: Modificar spa-router.js — Carga automática del welcome**

Al inicio del IIFE, eliminar:
```js
const welcomeScreen = document.getElementById('welcome-screen');
```

En `loadRoute()`, eliminar:
```js
if (welcomeScreen) welcomeScreen.style.display = 'none';
```

Cambiar la lógica de `onHashChange()`:
```js
function onHashChange() {
  const hash = window.location.hash.slice(1);
  if (hash && hash !== '/index.html' && hash !== 'index.html') {
    loadRoute(hash);
    const activeLink = document.querySelector(`#spa-sidebar a[href="${hash}"]`);
    if (activeLink) {
      activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  } else {
    loadRoute('/src/pages/welcome.html');
  }
}
```

Cambiar la inicialización al final:
```js
// Cargar ruta inicial
onHashChange();
```

Esto reemplaza el condicional `if (window.location.hash)` y garantiza que siempre se cargue algo (welcome por defecto o la ruta del hash).

**Step 4: Verificar en navegador**

1. Abrir `http://localhost:3000` sin hash → debe mostrar el welcome
2. Navegar a un componente → debe cargar normalmente
3. Volver a la raíz (borrar hash) → debe mostrar el welcome
4. Verificar que el roadmap interactivo (hover en niveles) funciona

**Step 5: Commit**

```bash
git add src/pages/welcome.html index.html src/js/spa-router.js && git commit -m "refactor: extract welcome screen to separate HTML file"
```

---

## Task 6: Caché de strings HTML en el router

**Files:**
- Modify: `src/js/spa-router.js` — agregar Map de caché + lógica de invalidación en dev

**Step 1: Agregar caché y detección de dev**

Después de `let currentPath = null;` y `const loadedCdns = new Set();`, agregar:

```js
const routeCache = new Map();
const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
```

**Step 2: Modificar loadRoute() para usar caché**

Reemplazar el bloque del fetch dentro de `loadRoute()`:

```js
// Antes:
const res = await fetch(path);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const text = await res.text();

// Después:
let text;
if (!isDev && routeCache.has(path)) {
  text = routeCache.get(path);
} else {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  text = await res.text();
  if (!isDev) routeCache.set(path, text);
}
```

**Step 3: Verificar en navegador**

1. Navegar a un componente, luego a otro, luego volver al primero → segunda carga debe ser instantánea (verificar en Network tab que no hay segundo fetch en producción)
2. En localhost la caché no se usa → siempre fetch fresco

**Step 4: Commit**

```bash
git add src/js/spa-router.js && git commit -m "perf: add HTML string cache to SPA router with dev bypass"
```

---

## Task 7: Prefetch en hover

**Files:**
- Modify: `src/js/spa-router.js` — agregar listener de mouseenter en sidebar

**Step 1: Agregar prefetch**

Después del listener de click del sidebar (`document.getElementById('spa-sidebar').addEventListener('click', ...)`), agregar:

```js
// ── Prefetch en hover ──────────────────────────────────────
document.getElementById('spa-sidebar').addEventListener('mouseenter', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const path = link.getAttribute('href');
  if (!path || routeCache.has(path)) return;
  fetch(path).then(r => r.ok ? r.text() : null).then(t => {
    if (t && !isDev) routeCache.set(path, t);
  });
}, true);
```

**Step 2: Verificar en navegador**

1. Abrir Network tab
2. Pasar el mouse por un componente en el sidebar → debe aparecer un fetch
3. Click en ese componente → NO debe haber segundo fetch (sale de caché)
4. En localhost: el fetch se hace (reduce latencia) pero no se cachea

**Step 3: Commit**

```bash
git add src/js/spa-router.js && git commit -m "perf: prefetch component HTML on sidebar hover"
```

---

## Task 8: Skeleton de carga

**Files:**
- Modify: `src/js/spa-router.js` — agregar skeleton antes del fetch

**Step 1: Agregar skeleton en loadRoute()**

Después de `cleanupAlpine();` y antes del bloque de fetch/caché, agregar:

```js
// Skeleton de carga
main.innerHTML = `
  <div class="px-6 py-12 max-w-5xl mx-auto space-y-6 animate-pulse">
    <div class="h-8 w-64 bg-zinc-200 rounded-lg"></div>
    <div class="h-4 w-96 bg-zinc-100 rounded"></div>
    <div class="h-64 bg-zinc-100 rounded-xl"></div>
  </div>`;
```

Eliminar la línea `main.innerHTML = '';` que existía antes (el skeleton la reemplaza).

**Step 2: Verificar en navegador**

1. Throttle network a "Slow 3G" en DevTools
2. Navegar a un componente pesado (N8 con ECharts) → debe mostrar skeleton pulsante
3. Al cargar → skeleton se reemplaza por el contenido real

**Step 3: Commit**

```bash
git add src/js/spa-router.js && git commit -m "ux: add skeleton loading state during route transitions"
```

---

## Task 9: Mejora de errores en scripts inline

**Files:**
- Modify: `src/js/spa-router.js` — mejorar catch de scripts para mostrar banner

**Step 1: Modificar el bloque de ejecución de scripts**

Reemplazar el bloque actual de ejecución de scripts:

```js
// Antes:
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

// Después:
let scriptError = false;
parsed.scripts.forEach(code => {
  try {
    const script = document.createElement('script');
    script.textContent = code;
    document.body.appendChild(script);
    document.body.removeChild(script);
  } catch (e) {
    console.warn('Error ejecutando script:', e);
    scriptError = true;
  }
});
```

**Step 2: Mostrar banner si hubo error**

Después de `Alpine.initTree(container);`, agregar:

```js
if (scriptError) {
  const banner = document.createElement('div');
  banner.className = 'bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg mb-4 mx-6 mt-4';
  banner.textContent = 'Un script de este componente falló al ejecutarse. Revisa la consola para más detalles.';
  container.prepend(banner);
}
```

**Step 3: Commit**

```bash
git add src/js/spa-router.js && git commit -m "ux: show warning banner when component scripts fail"
```

---

## Task 10: Sistema de descarga mejorado — Dos botones por variante

**Files:**
- Modify: `src/js/code-download.js` — reescribir `injectDownloadButtons`

**Step 1: Agregar función helper de feedback visual**

Después de `downloadFile()`, agregar:

```js
function showFeedback(btn, originalHtml, message) {
  btn.innerHTML = `
    <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
    <span class="text-xs text-emerald-600">${message}</span>`;
  setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
}
```

**Step 2: Reescribir botones por variante (cada `<section>`)**

Reemplazar el bloque de `sections.forEach` (líneas 52-70) por:

```js
const sections = container.querySelectorAll('section');
sections.forEach((section, i) => {
  section.style.position = 'relative';

  const wrapper = document.createElement('div');
  wrapper.className = 'absolute top-0 right-0 flex items-center gap-1';

  // Botón copiar HTML
  const copyHtml = `
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
    <span class="text-xs">Copiar HTML</span>`;
  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn-ghost btn-sm text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1';
  copyBtn.innerHTML = copyHtml;
  copyBtn.addEventListener('click', () => {
    const clone = section.cloneNode(true);
    const btns = clone.querySelector('.absolute.top-0.right-0');
    if (btns) btns.remove();
    clone.style.position = '';
    navigator.clipboard.writeText(clone.outerHTML);
    showFeedback(copyBtn, copyHtml, '¡Copiado!');
  });

  // Botón descargar standalone
  const dlHtml = `
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    <span class="text-xs">Descargar</span>`;
  const dlBtn = document.createElement('button');
  dlBtn.className = 'btn-ghost btn-sm text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1';
  dlBtn.innerHTML = dlHtml;
  dlBtn.addEventListener('click', async () => {
    const css = await getCssContent();
    const variantHtml = buildVariantFile(section, fileName, i + 1, css, _parsedScripts, _parsedStyles, _parsedCdns);
    downloadFile(`${fileName}-variante-${i + 1}.html`, variantHtml);
    showFeedback(dlBtn, dlHtml, '¡Descargado!');
  });

  wrapper.appendChild(copyBtn);
  wrapper.appendChild(dlBtn);
  section.appendChild(wrapper);
});
```

**Step 3: Agregar botón "Copiar HTML" al header del componente**

Después del botón "Descargar componente" existente (líneas 35-49), agregar un segundo botón:

```js
// Botón copiar HTML completo
const copyFullHtml = `
  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
  Copiar HTML`;
const copyFullBtn = document.createElement('button');
copyFullBtn.className = 'btn-secondary btn-sm mt-3 ml-2 inline-flex items-center gap-1.5';
copyFullBtn.innerHTML = copyFullHtml;
copyFullBtn.addEventListener('click', () => {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  doc.body.querySelectorAll('script').forEach(s => s.remove());
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
  navigator.clipboard.writeText(doc.body.innerHTML.trim());
  showFeedback(copyFullBtn, copyFullHtml, '¡Copiado!');
});
header.appendChild(copyFullBtn);
```

También agregar feedback visual al botón de descarga existente. Guardar el HTML original del botón y usar `showFeedback` tras el click.

**Step 4: Commit**

```bash
git add src/js/code-download.js && git commit -m "feat: add copy-to-clipboard buttons and visual feedback to downloads"
```

---

## Task 11: Habilitar descarga para páginas

**Files:**
- Modify: `src/js/code-download.js` — ampliar regex para incluir páginas

**Step 1: Cambiar el regex de filtro**

Línea 19, cambiar:
```js
const isComponent = /\/src\/components\/n[1-8]-/.test(filePath);
if (!isComponent) return;
```
Por:
```js
const isComponent = /\/src\/components\/n[1-8]-/.test(filePath);
const isPage = /\/src\/pages\//.test(filePath);
if (!isComponent && !isPage) return;
```

**Step 2: Solo botones de header para páginas**

Envolver el bloque de `sections.forEach` (botones por variante) en un condicional:

```js
if (isComponent) {
  // ... bloque existente de botones por variante (sections.forEach)
}
```

Esto asegura que las páginas solo obtienen los botones del header (descargar + copiar), no los botones por variante.

**Step 3: Verificar en navegador**

1. Navegar a un componente (ej. C01) → debe tener botones de header + botones por variante
2. Navegar a una página (ej. P50) → debe tener solo botones de header (descargar + copiar)
3. Descargar una página → debe funcionar como standalone al abrirla en el navegador

**Step 4: Commit**

```bash
git add src/js/code-download.js && git commit -m "feat: enable download and copy buttons for pages"
```

---

## Task 12: Verificación final y rebuild CSS

**Step 1: Rebuild Tailwind CSS**

```bash
npm run build
```

Confirmar que `animate-pulse` y cualquier clase nueva del skeleton estén incluidas en el CSS compilado. Si no, ejecutar `npm run dev` para regenerar.

**Step 2: Test manual completo**

1. Cargar sin hash → welcome screen
2. Navegar a componente N1 → skeleton → contenido + botones (copiar + descargar)
3. Navegar a componente N8 (charts) → skeleton → CDN carga → contenido
4. Volver al componente N1 → carga instantánea (caché)
5. Navegar a página P50 → solo botones de header
6. Descargar componente completo → archivo standalone funciona
7. Copiar variante al clipboard → pegar en editor → HTML limpio sin CSS
8. Descargar variante → archivo standalone con CSS inline funciona
9. Sidebar muestra "117 componentes · 66 páginas"
10. Dark mode funciona en toda la UI

**Step 3: Commit final**

```bash
npm run build && git add -A && git commit -m "build: rebuild Tailwind CSS with refactored SPA"
```
