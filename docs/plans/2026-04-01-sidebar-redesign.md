# Sidebar Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redisenar el sidebar del SPA navigator con estilo dark (Linear/VS Code), secciones colapsables, buscador, iconos por categoria y mejor UX.

**Architecture:** Reemplazar el sidebar estatico en `index.html` por un componente Alpine.js con estado reactivo. Los datos de navegacion se definen como array JS. El buscador filtra en tiempo real. Las secciones usan `x-collapse` para animar. Estado de secciones abiertas persiste en `localStorage`.

**Tech Stack:** Alpine.js (ya incluido), Tailwind CSS (clases existentes), x-collapse plugin (ya incluido)

---

### Task 1: Definir datos de navegacion como estructura JS

**Files:**
- Modify: `index.html` (sidebar section, lines 12-327)

**Step 1: Crear el x-data del sidebar**

Reemplazar el `x-data="{ sidebarOpen: true }"` del div wrapper por un componente Alpine completo que contenga:
- `sidebarOpen: true`
- `search: ''` — texto del buscador
- `openSections: JSON.parse(localStorage.getItem('sidebar-open') || '{}')` — estado persistente
- `sections: [...]` — array con todas las secciones, cada una con: `id`, `title`, `icon` (SVG path), `type` ('component' | 'page'), `items: [{href, label}]`

Las 15 secciones actuales son:
1. General (1 item: Design Tokens)
2. N1 Fundamentos (11 items: C01-C11)
3. N2 Layout (20 items: C12-C31)
4. N3 Alpine basico (15 items: C32-C46)
5. N4 Estado reactivo (19 items: C47-C65)
6. N5 CRUD (20 items: C66-C85)
7. N6 Avanzado (16 items: C86-C101)
8. N7 Shells (6 items: C102-C107)
9. N8 Charts (10 items: C108-C117)
10. Paginas N2 Layout (7 items: P01-P07)
11. Paginas N3 Alpine (5 items: P08-P12)
12. Paginas N4 Reactivo (12 items: P13-P24)
13. Paginas N5 CRUD (13 items: P25-P37)
14. Paginas N6 Avanzado (12 items: P38-P49)
15. Paginas N7 Dashboards (17 items: P50-P66)

**Step 2: Definir metodos del componente**

```javascript
toggle(id) {
  this.openSections[id] = !this.openSections[id];
  localStorage.setItem('sidebar-open', JSON.stringify(this.openSections));
},
filteredSections() {
  if (!this.search.trim()) return this.sections;
  const q = this.search.toLowerCase();
  return this.sections
    .map(s => ({
      ...s,
      items: s.items.filter(i => i.label.toLowerCase().includes(q))
    }))
    .filter(s => s.items.length > 0);
},
isOpen(id) {
  if (this.search.trim()) return true; // abrir todo al buscar
  return !!this.openSections[id];
}
```

**Step 3: Verificar que el JS no tiene errores de sintaxis**

Abrir en browser, verificar consola sin errores.

**Step 4: Commit**

```bash
git add index.html
git commit -m "refactor: extract sidebar navigation data into Alpine.js data structure"
```

---

### Task 2: Aplicar tema dark al sidebar

**Files:**
- Modify: `index.html` (aside element and its children)

**Step 1: Cambiar clases del aside**

Reemplazar:
```html
class="h-full overflow-y-auto border-r border-zinc-200 bg-white flex flex-col shrink-0 transition-all duration-300"
```

Por:
```html
class="h-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 transition-all duration-300"
```

Actualizar `:class` para que el borde cerrado use `border-r-0`.

**Step 2: Actualizar header del sidebar (logo)**

Reemplazar el div del logo por:
```html
<div class="px-4 py-4 border-b border-zinc-800/60 flex items-center justify-between">
  <div class="flex items-center gap-2.5">
    <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    </div>
    <span class="text-sm font-semibold text-zinc-100 tracking-tight">LayoutOS</span>
  </div>
  <span class="text-[10px] text-zinc-600 font-mono">v0.1</span>
</div>
```

**Step 3: Actualizar footer del sidebar**

Reemplazar por:
```html
<div class="px-4 py-3 border-t border-zinc-800/60">
  <p class="text-[11px] text-zinc-600">107 componentes · 66 paginas</p>
  <p class="text-[10px] text-zinc-700 mt-0.5">Tailwind CSS + Alpine.js</p>
</div>
```

**Step 4: Verificar visualmente**

Abrir en browser, confirmar que el sidebar tiene fondo oscuro con buen contraste.

**Step 5: Commit**

```bash
git add index.html
git commit -m "style: apply dark theme to sidebar shell"
```

---

### Task 3: Agregar buscador de componentes

**Files:**
- Modify: `index.html` (entre el logo y el nav)

**Step 1: Insertar search bar despues del logo div**

```html
<div class="px-3 py-3">
  <div class="relative">
    <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      x-model="search"
      placeholder="Buscar componente..."
      class="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
    />
    <kbd
      x-show="!search"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded font-mono"
    >/</kbd>
    <button
      x-show="search"
      @click="search = ''"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>
```

**Step 2: Agregar listener de teclado para "/" shortcut**

En el x-data component, agregar un `x-init` o un `@keydown.window` que enfoque el input al presionar "/":

```html
@keydown.slash.window.prevent="$refs.searchInput.focus()"
```

Y agregar `x-ref="searchInput"` al input.

**Step 3: Verificar que el buscador filtra correctamente**

Abrir browser, escribir "kanban", verificar que solo muestra las secciones con items que contienen "kanban".

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add search bar to sidebar with keyboard shortcut"
```

---

### Task 4: Implementar secciones colapsables con iconos

**Files:**
- Modify: `index.html` (reemplazar todo el contenido del `<nav>`)

**Step 1: Reemplazar el nav estatico por template dinamico**

Reemplazar todo el contenido de `<nav id="spa-sidebar">` por:

```html
<!-- Separador Componentes -->
<p class="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2"
   x-show="filteredSections().some(s => s.type === 'component')">
  Componentes
</p>

<template x-for="section in filteredSections().filter(s => s.type === 'component')" :key="section.id">
  <div class="mb-1">
    <!-- Section header -->
    <button
      @click="toggle(section.id)"
      class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors duration-150 cursor-pointer group"
    >
      <span class="w-4 h-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" x-html="section.icon"></span>
      <span class="text-xs font-medium flex-1 text-left truncate" x-text="section.title"></span>
      <span class="text-[10px] text-zinc-700 tabular-nums" x-text="section.items.length"></span>
      <svg
        class="w-3 h-3 text-zinc-700 transition-transform duration-200"
        :class="isOpen(section.id) ? 'rotate-90' : ''"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    <!-- Section items -->
    <div x-show="isOpen(section.id)" x-collapse>
      <ul class="mt-0.5 ml-3 border-l border-zinc-800/80 pl-3 space-y-px">
        <template x-for="item in section.items" :key="item.href">
          <li>
            <a
              :href="item.href"
              class="flex items-center gap-2 px-2 py-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors duration-150 text-xs"
              :class="currentPath === item.href ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 -ml-[13px] pl-[19px]' : ''"
            >
              <span class="w-1 h-1 rounded-full shrink-0" :class="currentPath === item.href ? 'bg-blue-400' : 'bg-zinc-700'"></span>
              <span x-text="item.label" class="truncate"></span>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<!-- Separador Paginas -->
<div class="my-3 mx-3 border-t border-zinc-800/60"
     x-show="filteredSections().some(s => s.type === 'page')"></div>
<p class="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2"
   x-show="filteredSections().some(s => s.type === 'page')">
  Paginas
</p>

<template x-for="section in filteredSections().filter(s => s.type === 'page')" :key="section.id">
  <!-- Misma estructura que componentes pero con dot verde -->
  <!-- (identico al template anterior, cambiando blue por emerald en el active state) -->
</template>
```

**Step 2: Exponer `currentPath` al scope de Alpine**

El `spa-router.js` mantiene `currentPath` en su IIFE. Necesitamos exponerlo al scope global para que Alpine pueda leer el item activo. Modificar `spa-router.js` para despachar un evento custom:

En `spa-router.js`, despues de `currentPath = path;` (linea ~133), agregar:
```javascript
window.dispatchEvent(new CustomEvent('route-changed', { detail: { path } }));
```

En el x-data del sidebar, agregar:
```javascript
currentPath: null,
```

Y en el aside, agregar:
```html
@route-changed.window="currentPath = $event.detail.path"
```

**Step 3: Iconos SVG por seccion**

Definir los paths SVG para cada seccion en el array `sections`:
- General: grid/squares icon
- N1 Fundamentos: cube icon
- N2 Layout: layout/columns icon
- N3 Alpine: bolt/lightning icon
- N4 Estado reactivo: arrows/refresh icon
- N5 CRUD: database icon
- N6 Avanzado: rocket icon
- N7 Shells: window/terminal icon
- N8 Charts: chart-bar icon
- Paginas: document icon (compartido para todas las secciones de paginas)

**Step 4: Verificar visualmente**

Abrir browser:
- Verificar que las secciones se abren/cierran con animacion
- Verificar que el buscador filtra y abre secciones automaticamente
- Verificar que el item activo se resalta correctamente
- Verificar que refrescar mantiene las secciones abiertas/cerradas

**Step 5: Commit**

```bash
git add index.html src/js/spa-router.js
git commit -m "feat: implement collapsible sidebar sections with icons and active state"
```

---

### Task 5: Ajustes finales y scrollbar custom

**Files:**
- Modify: `index.html` (style tag in head)

**Step 1: Agregar scrollbar custom para el sidebar dark**

En el `<style>` del head, agregar:
```css
#spa-sidebar::-webkit-scrollbar { width: 4px; }
#spa-sidebar::-webkit-scrollbar-track { background: transparent; }
#spa-sidebar::-webkit-scrollbar-thumb { background: rgb(63 63 70); border-radius: 4px; }
#spa-sidebar::-webkit-scrollbar-thumb:hover { background: rgb(82 82 91); }
```

Nota: mover el `id="spa-sidebar"` al elemento scrollable que es el `<aside>` mismo en vez del `<nav>`, o aplicar las reglas al aside directamente.

**Step 2: Agregar transicion suave al abrir/cerrar sidebar**

Verificar que el toggle del sidebar principal (boton hamburguesa) sigue funcionando con el tema dark. Ajustar el `:class` del aside si es necesario.

**Step 3: Verificar todo el flujo**

- Abrir/cerrar sidebar con boton hamburguesa
- Buscar componentes con "/" shortcut
- Navegar entre componentes
- Verificar active state al cambiar de ruta
- Verificar persistencia de secciones abiertas
- Verificar que no hay errores en consola

**Step 4: Commit**

```bash
git add index.html
git commit -m "style: add custom scrollbar and final sidebar polish"
```

---

### Notas para el implementador

- El archivo `index.html` es grande (~388 lineas). El sidebar ocupa lineas 14-327.
- Alpine.js y el plugin collapse ya estan cargados al final del body.
- `spa-router.js` maneja la navegacion SPA — hay que coordinarse con el via eventos custom.
- Los links deben mantener sus `href` exactos ya que `spa-router.js` usa `querySelector('#spa-sidebar a[href]')` para los navLinks. Asegurarse de que el `id="spa-sidebar"` siga en el nav o actualizar el selector en `spa-router.js`.
- La clase activa actual (`bg-blue-50 text-blue-600 font-medium`) es aplicada por `spa-router.js` — con el nuevo approach via Alpine, hay que desactivar esa logica en `spa-router.js` o dejarla compatible.
