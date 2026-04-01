# Diseño: Refactorización SPA LayoutOS

**Fecha:** 2026-04-01  
**Estado:** Aprobado  
**Objetivo:** Optimizar la SPA sin romper funcionalidad existente ni agregar complejidad innecesaria al tooling.

---

## Principios

- Zero-tooling nuevo (no chokidar, no generadores automáticos)
- Toda refactorización es interna — el usuario final ve la misma UI pero más rápida
- Las descargas se vuelven más útiles (copiar snippet + descargar standalone)
- Eliminamos código muerto, no agregamos abstracciones prematuras

## Fuera de alcance

- Automatización del sidebar desde filesystem (catálogo completo, no se justifica)
- Separar `parseBody()` a su propio archivo (cohesivo con el router)
- Rediseño visual de ningún tipo

---

## Fase 1: Limpieza y fixes rápidos

### 1.1 Eliminar archivos muertos

| Archivo | Justificación |
|---------|---------------|
| `src/js/alpine-stores.js` | No se carga en `index.html`. Los componentes que usan `Alpine.store()` definen los suyos localmente |
| `src/js/utils.js` | No se importa en ningún lado. `formatDate` y `formatCurrency` están redefinidos localmente en C58 y C95 |

### 1.2 Fixes en `code-download.js`

- Línea 2: Cambiar comentario `"N1-N6"` → `"N1-N8"` para alinear con el regex real de línea 19
- Línea 62: Renombrar `"Copiar variante"` → `"Descargar variante"` para reflejar la acción real

### 1.3 Fix conteo hardcodeado en `index.html:134`

Cambiar texto estático `"107 componentes · 66 paginas"` por binding dinámico:

```html
<p x-text="componentCount + ' componentes · ' + pageCount + ' páginas'"></p>
```

Con getters computados en `Alpine.data('sidebar')` de `sidebar-data.js`:

```js
get componentCount() {
  return this.sections.filter(s => s.type === 'component')
    .reduce((a, s) => a + s.items.length, 0);
},
get pageCount() {
  return this.sections.filter(s => s.type === 'page')
    .reduce((a, s) => a + s.items.length, 0);
}
```

### 1.4 Eliminar función muerta en `spa-router.js`

Eliminar `updateActiveLink()` (no-op en líneas 159-161) y su invocación en línea 135.

### 1.5 Auditoría de `<section>` en componentes N1-N8

Verificar que todos los componentes usen `<section>` para envolver variantes. Documentar excepciones. Prerequisito para Fase 4.

---

## Fase 2: Extraer Welcome Screen

### 2.1 Crear `/src/pages/welcome.html`

Mover las ~230 líneas del welcome screen (`index.html:178-416`) a un archivo HTML standalone con estructura estándar de componente:

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
  <div class="px-6 py-12 max-w-4xl mx-auto space-y-16" x-data="{ activeLevel: null }">
    <!-- Contenido del welcome -->
  </div>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
```

Los conteos (117 componentes, 66 páginas, 8 niveles) se mantienen hardcodeados en el welcome — son datos estáticos de un catálogo completo.

### 2.2 Modificar `spa-router.js` — Carga automática

- Si no hay hash al cargar → `loadRoute('/src/pages/welcome.html')`
- Si el hash cambia a vacío → `loadRoute('/src/pages/welcome.html')`
- Eliminar toda referencia a `welcomeScreen` y `getElementById('welcome-screen')`

### 2.3 Simplificar `index.html`

El `<main>` queda vacío:

```html
<main id="spa-content" class="flex-1 overflow-y-auto bg-zinc-50"></main>
```

Se eliminan ~230 líneas. `index.html` pasa de ~440 a ~210 líneas.

---

## Fase 3: Caché del Router + Prefetch + Skeleton

### 3.1 Caché de strings HTML

```js
const routeCache = new Map();
```

- Antes del fetch: si `routeCache.has(path)` → usar string cacheado
- Si no: fetch y `routeCache.set(path, text)`
- `parseBody()` y `Alpine.initTree()` se ejecutan SIEMPRE (nunca cachear DOM)
- **Invalidación en dev:** si `location.hostname === 'localhost' || location.hostname === '127.0.0.1'`, no usar caché

### 3.2 Prefetch en hover

Listener en el sidebar con `mouseenter` (capture phase):

```js
document.getElementById('spa-sidebar').addEventListener('mouseenter', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const path = link.getAttribute('href');
  if (routeCache.has(path)) return;
  fetch(path).then(r => r.ok ? r.text() : null).then(t => {
    if (t) routeCache.set(path, t);
  });
}, true);
```

Solo prefetch del HTML. CDNs pesados (ECharts) se cargan solo en `loadRoute()` tras click real.

### 3.3 Skeleton de carga

Antes del fetch, inyectar placeholder mínimo con `animate-pulse`:

```js
main.innerHTML = `
  <div class="px-6 py-12 max-w-5xl mx-auto space-y-6 animate-pulse">
    <div class="h-8 w-64 bg-zinc-200 rounded-lg"></div>
    <div class="h-4 w-96 bg-zinc-100 rounded"></div>
    <div class="h-64 bg-zinc-100 rounded-xl"></div>
  </div>`;
```

### 3.4 Mejora del manejo de errores en scripts

Si un script inline falla, mostrar banner de advertencia no-intrusivo sobre el contenido:

```html
<div class="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg mb-4">
  Un script de este componente falló. Revisa la consola.
</div>
```

El componente se sigue renderizando — solo pierde interactividad.

---

## Fase 4: Mejoras al Sistema de Descargas

### 4.1 Dos botones por variante

Reemplazar el botón único por dos diferenciados en esquina superior derecha de cada `<section>`:

| Botón | Acción | Contenido |
|-------|--------|-----------|
| Copiar HTML | `navigator.clipboard.writeText()` | Solo `outerHTML` de la sección, sin CSS. Asume que el usuario ya tiene Tailwind |
| Descargar | `downloadFile()` (actual) | Archivo standalone completo con CSS inline + scripts + CDNs |

### 4.2 Botón de componente completo en el header

Se mantiene "Descargar componente" actual. Se agrega "Copiar HTML" al lado (copia `body.innerHTML` sin `<head>`, sin CSS, sin Alpine CDN).

### 4.3 Feedback visual

Tras click en cualquier botón:

- Copiar: icono cambia a checkmark + "¡Copiado!" por 2 segundos
- Descargar: icono cambia a checkmark + "¡Descargado!" por 2 segundos
- Revertir con `setTimeout(() => ..., 2000)`

### 4.4 Habilitar descarga para páginas

Ampliar regex en `injectDownloadButtons`:

```js
const isDownloadable = /\/src\/(components|pages)\//.test(filePath);
```

Solo botón de componente completo en el header. Sin botones por variante en páginas (no tienen estructura de `<section>` con variantes). Las páginas son autocontenidas — la descarga standalone funciona sin modificaciones a `makeStandalone()`.
