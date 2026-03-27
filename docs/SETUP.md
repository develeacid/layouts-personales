# SETUP.md — Configuración técnica LayoutOS
> Documento de contexto v1.0 · Referencia de sesión para VSCode
> Stack: Node · Tailwind CSS v4 · Alpine.js v3 · Git

---

## Inicio rápido

```bash
# Clonar e instalar
git clone <repo-url> layoutos
cd layoutos
npm install

# Desarrollo
npm run dev       # servidor con live reload en localhost:3000

# Build
npm run build     # genera /dist con assets optimizados
```

---

## Estructura del proyecto

```
layoutos/
├── src/
│   ├── components/          # Componentes atómicos (un archivo por componente)
│   │   ├── n1-fundamentos/
│   │   │   ├── C01-banners.html
│   │   │   ├── C02-customer-logos.html
│   │   │   └── ...
│   │   ├── n2-layout/
│   │   ├── n3-alpine-basico/
│   │   ├── n4-estado-reactivo/
│   │   ├── n5-crud/
│   │   ├── n6-avanzado/
│   │   └── n7-shells/
│   │
│   ├── pages/               # Páginas completas (ensamblan componentes)
│   │   ├── n2-layout/
│   │   │   ├── P01-404.html
│   │   │   └── ...
│   │   ├── n3-alpine/
│   │   ├── n4-reactivo/
│   │   ├── n5-crud/
│   │   ├── n6-avanzado/
│   │   └── n7-dashboards/
│   │
│   ├── layouts/             # Shells reutilizables (base para páginas)
│   │   ├── base.html        # HTML base: head, meta, scripts
│   │   ├── app-shell.html   # Sidebar + header + content slot
│   │   └── auth.html        # Layout centrado para login/register
│   │
│   ├── css/
│   │   ├── main.css         # Entry point: @import tailwind + capas custom
│   │   └── components.css   # Clases custom que no cubre Tailwind solo
│   │
│   └── js/
│       ├── alpine-stores.js  # Alpine.store() globales del proyecto
│       └── utils.js          # Helpers JS puros (formatDate, formatCurrency…)
│
├── public/                  # Assets estáticos (se copian tal cual a /dist)
│   ├── fonts/
│   ├── icons/
│   └── images/
│       └── avatars/         # Avatares de placeholder para demos
│
├── dist/                    # Build output — NO editar, NO commitear
│
├── docs/                    # Documentos de contexto del proyecto
│   ├── BRANDING.md
│   ├── ROADMAP.md
│   └── SETUP.md             # Este archivo
│
├── tailwind.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Dependencias

```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/cli": "^4.0.0",
    "browser-sync": "^3.0.0",
    "npm-run-all": "^4.1.5"
  }
}
```

```json
{
  "scripts": {
    "dev":   "npm-run-all --parallel watch:css watch:html",
    "watch:css":  "tailwindcss -i ./src/css/main.css -o ./public/css/main.css --watch",
    "watch:html": "browser-sync start --server --files '**/*.html, public/css/*.css'",
    "build": "tailwindcss -i ./src/css/main.css -o ./dist/css/main.css --minify"
  }
}
```

> Alpine.js se carga vía CDN en `base.html` — sin bundler, sin build step para JS.
> Esto mantiene el stack simple durante el aprendizaje.

---

## Tailwind config — tokens del branding

```js
// tailwind.config.js
export default {
  content: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {

      // ── Colores ──────────────────────────────────────────────
      colors: {
        // Semánticos de la app (alias sobre Tailwind nativo)
        page:      '#FAFAFA',   // zinc-50
        surface:   '#F4F4F5',   // zinc-100
        muted:     '#A1A1AA',   // zinc-400
        secondary: '#52525B',   // zinc-600
        primary:   '#18181B',   // zinc-900
        dark:      '#09090B',   // zinc-950
        accent: {
          subtle:  '#EFF6FF',   // blue-50
          light:   '#DBEAFE',   // blue-100
          border:  '#BFDBFE',   // blue-200
          icon:    '#3B82F6',   // blue-500
          DEFAULT: '#2563EB',   // blue-600
          hover:   '#1D4ED8',   // blue-700
        },
      },

      // ── Fuentes ──────────────────────────────────────────────
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        // Reemplazar aquí cuando se agregue fuente custom
      },

      // ── Sombras custom ───────────────────────────────────────
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,.06)',
        'sm': '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)',
        'md': '0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.05)',
        'lg': '0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05)',
        'xl': '0 20px 25px rgba(0,0,0,.08), 0 8px 10px rgba(0,0,0,.05)',
      },

      // ── Radios ───────────────────────────────────────────────
      // Tailwind ya tiene: rounded (4px), rounded-lg (8px),
      // rounded-xl (12px), rounded-2xl (16px), rounded-full
      // No se necesita extender — usar los nativos

      // ── Transiciones ─────────────────────────────────────────
      transitionDuration: {
        '75':  '75ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      // ── Z-index ──────────────────────────────────────────────
      zIndex: {
        'dropdown':  '10',
        'modal':     '20',
        'toast':     '30',
        'sidebar':   '40',
        'overlay':   '50',
      },

    }
  },
  plugins: [],
}
```

---

## CSS entry point

```css
/* src/css/main.css */
@import "tailwindcss";

/* ── Capa base: resets y variables ─── */
@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  html { -webkit-font-smoothing: antialiased; }

  body {
    @apply bg-page text-primary font-sans text-sm leading-relaxed;
  }

  /* Scrollbar custom — sutil, consistente */
  ::-webkit-scrollbar       { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { @apply bg-zinc-300 rounded-full; }
}

/* ── Capa de componentes: clases custom ─── */
@layer components {

  /* Botones */
  .btn         { @apply inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer select-none; }
  .btn-primary { @apply btn bg-accent text-white hover:bg-accent-hover active:scale-95; }
  .btn-secondary { @apply btn bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:scale-95; }
  .btn-ghost   { @apply btn text-accent hover:bg-accent-subtle active:scale-95; }
  .btn-danger  { @apply btn bg-rose-600 text-white hover:bg-rose-700 active:scale-95; }
  .btn-sm      { @apply px-3 py-1.5 text-xs; }
  .btn-lg      { @apply px-6 py-3 text-base; }

  /* Inputs */
  .input {
    @apply w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-primary
           placeholder-muted bg-white
           focus:outline-none focus:border-accent-border focus:ring-2 focus:ring-accent-light
           transition-all duration-150;
  }
  .input-error {
    @apply border-rose-400 focus:border-rose-400 focus:ring-rose-200;
  }

  /* Cards */
  .card        { @apply bg-white border border-zinc-200 rounded-xl shadow-sm p-6; }
  .card-hover  { @apply card hover:shadow-md hover:-translate-y-px transition-all duration-200 cursor-pointer; }

  /* Badges */
  .badge       { @apply inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full; }
  .badge-blue  { @apply badge bg-accent-light text-accent-hover; }
  .badge-green { @apply badge bg-emerald-50 text-emerald-600; }
  .badge-amber { @apply badge bg-amber-50 text-amber-600; }
  .badge-rose  { @apply badge bg-rose-50 text-rose-600; }
  .badge-zinc  { @apply badge bg-zinc-100 text-zinc-600; }

  /* Labels de formulario */
  .label       { @apply block text-xs font-medium text-zinc-600 mb-1.5; }
  .hint        { @apply text-xs text-muted mt-1; }
  .error-msg   { @apply text-xs text-rose-600 mt-1; }

  /* Dividers */
  .divider     { @apply border-t border-zinc-200; }
  .divider-label {
    @apply relative flex items-center gap-3 text-xs text-muted;
  }
  .divider-label::before,
  .divider-label::after {
    content: '';
    @apply flex-1 border-t border-zinc-200;
  }

  /* Sidebar nav item */
  .nav-item    { @apply flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer; }
  .nav-item-light       { @apply nav-item text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900; }
  .nav-item-light.active { @apply bg-accent-subtle text-accent font-medium; }
  .nav-item-dark        { @apply nav-item text-zinc-400 hover:bg-zinc-800 hover:text-white; }
  .nav-item-dark.active  { @apply bg-accent text-white font-medium; }
}
```

---

## Base HTML — template de cada archivo

```html
<!-- src/layouts/base.html -->
<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LayoutOS · [Nombre del componente]</title>
  <link rel="stylesheet" href="/public/css/main.css" />
</head>
<body class="h-full bg-page antialiased">

  <!-- CONTENIDO AQUÍ -->

  <!-- Alpine.js — siempre al final del body -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <!-- Stores globales (solo en páginas que los necesiten) -->
  <!-- <script src="/src/js/alpine-stores.js"></script> -->
</body>
</html>
```

---

## Convenciones de Alpine.js

### Regla 1 — `x-data` inline para componentes simples

```html
<!-- Correcto para un componente aislado -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>Contenido</div>
</div>
```

### Regla 2 — Función nombrada para componentes con lógica

Cuando el componente tiene más de 3 propiedades o métodos, sacar a función.

```html
<div x-data="dropdown()">...</div>

<script>
  function dropdown() {
    return {
      open: false,
      selected: null,
      options: ['Opción A', 'Opción B'],
      toggle()  { this.open = !this.open },
      select(v) { this.selected = v; this.open = false },
      close()   { this.open = false },
    }
  }
</script>
```

### Regla 3 — `Alpine.store()` para estado compartido entre componentes

Solo cuando dos o más componentes en la misma página necesitan el mismo estado.

```js
// src/js/alpine-stores.js
document.addEventListener('alpine:init', () => {

  Alpine.store('notifications', {
    items: [],
    unread: 0,
    add(msg, type = 'info') {
      this.items.push({ id: Date.now(), msg, type });
      this.unread++;
    },
    clear() { this.items = []; this.unread = 0; }
  })

  Alpine.store('sidebar', {
    collapsed: false,
    toggle() { this.collapsed = !this.collapsed }
  })

})
```

```html
<!-- Uso en cualquier componente de la página -->
<button @click="$store.sidebar.toggle()">☰</button>
<nav :class="$store.sidebar.collapsed ? 'w-16' : 'w-64'">...</nav>
```

### Regla 4 — Transiciones estándar del proyecto

```html
<!-- Aparecer / desaparecer -->
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-200"
  x-transition:enter-start="opacity-0 -translate-y-1"
  x-transition:enter-end="opacity-100 translate-y-0"
  x-transition:leave="transition ease-in duration-150"
  x-transition:leave-start="opacity-100 translate-y-0"
  x-transition:leave-end="opacity-0 -translate-y-1"
>
```

```html
<!-- Overlay / modal backdrop -->
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0"
  x-transition:enter-end="opacity-100"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="opacity-100"
  x-transition:leave-end="opacity-0"
  class="fixed inset-0 bg-zinc-950/50 z-overlay"
>
```

```html
<!-- Drawer lateral -->
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="translate-x-full"
  x-transition:enter-end="translate-x-0"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="translate-x-0"
  x-transition:leave-end="translate-x-full"
  class="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-sidebar"
>
```

---

## Convenciones de archivos y nomenclatura

```
# Archivos de componentes
src/components/n3-alpine-basico/C33-side-navigations.html
                ^nivel            ^número-nombre-en-kebab-case

# Archivos de páginas
src/pages/n4-reactivo/P13-users-page.html

# Clases CSS custom (en components.css)
.btn, .btn-primary      → componente y variante
.nav-item-dark          → componente + contexto
.badge-green            → componente + modificador semántico

# Variables JS
camelCase para todo     → isOpen, selectedTab, currentPage
sin abreviaciones       → no: `btn`, sí: `button`
```

---

## Git workflow

### Ramas

```bash
main          # producción — solo merge de releases
dev           # rama de desarrollo activa
feat/C01-banners          # rama de un componente
feat/P01-404              # rama de una página
fix/C33-sidebar-mobile    # corrección puntual
```

### Flujo por componente

```bash
# 1. Crear rama desde dev
git checkout dev
git pull
git checkout -b feat/C33-side-navigations

# 2. Trabajar y hacer commits atómicos
git add src/components/n3-alpine-basico/C33-side-navigations.html
git commit -m "feat(C33): sidebar colapsable con x-show"

git add src/components/n3-alpine-basico/C33-side-navigations.html
git commit -m "feat(C33): active state y submenú accordion"

git add src/components/n3-alpine-basico/C33-side-navigations.html
git commit -m "feat(C33): responsive mobile con overlay"

# 3. Merge a dev cuando el componente está completo
git checkout dev
git merge feat/C33-side-navigations
git branch -d feat/C33-side-navigations
```

### Formato de commits

```
tipo(scope): descripción corta en presente

tipos:  feat | fix | style | refactor | docs | chore
scope:  C01, P01, branding, config, deps

feat(C41):    tabs con x-data y transición
feat(P13):    users page ensamblada desde C47+C48+C09
fix(C56):     toggle de password no funcionaba en Safari
style(C07):   ajuste de padding en KPI cards
refactor(C48): extraer lógica de sort a función nombrada
docs(roadmap): agregar C108 notificaciones push
chore(deps):  actualizar Alpine a 3.14
```

### Tags de versión por nivel completado

```bash
git tag -a v0.1.0 -m "Nivel 1 completo — C01 a C11"
git tag -a v0.2.0 -m "Nivel 2 completo — C12 a C31"
git tag -a v0.3.0 -m "Nivel 3 completo — C32 a C46"
# ...
git tag -a v1.0.0 -m "Nivel 7 completo — todos los componentes"
git tag -a v1.1.0 -m "Páginas N2–N4 completas"
git tag -a v2.0.0 -m "Todas las páginas completas"
```

---

## VSCode — configuración recomendada

### Extensiones

```
bradlc.vscode-tailwindcss          # IntelliSense de Tailwind
esbenp.prettier-vscode             # Formateo automático
formulahendry.auto-rename-tag      # Rename paired HTML tags
vincaslt.colorize                  # Ver colores hex en el editor
christian-kohler.path-intellisense # Autocomplete de paths
```

### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.associations": {
    "*.html": "html"
  },
  "tailwindCSS.includeLanguages": {
    "html": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["@apply\\s+([^;]*);", "([^\\s]+)"]
  ],
  "emmet.includeLanguages": {
    "html": "html"
  }
}
```

### `.prettierrc`

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": false,
  "trailingComma": "none",
  "htmlWhitespaceSensitivity": "ignore"
}
```

---

## Checklist antes de commitear un componente

```
[ ] El HTML es semántico (nav, main, section, article, button, no solo divs)
[ ] Funciona en mobile (revisar en 375px y 768px mínimo)
[ ] Los colores usan clases del branding, no valores hardcoded
[ ] Las transiciones usan las duraciones estándar (150ms hover, 300ms entrada)
[ ] Si usa Alpine: x-data funciona sin errores en consola
[ ] Si tiene formulario: los inputs tienen label asociado (accesibilidad)
[ ] No hay clases Tailwind duplicadas en el mismo elemento
[ ] El archivo está en la carpeta correcta según su nivel
[ ] El nombre del archivo sigue la convención: CXX-nombre-kebab.html
```

---

## Referencia rápida de clases custom

| Clase             | Descripción                              |
|-------------------|------------------------------------------|
| `.btn-primary`    | Botón azul sólido con hover y scale      |
| `.btn-secondary`  | Botón blanco con borde                   |
| `.btn-ghost`      | Botón transparente, texto azul           |
| `.btn-danger`     | Botón rojo para acciones destructivas    |
| `.btn-sm / lg`    | Modificadores de tamaño                  |
| `.input`          | Input base con focus ring azul           |
| `.input-error`    | Input con estados de error en rosa       |
| `.card`           | Card blanca con borde y sombra           |
| `.card-hover`     | Card con hover elevado                   |
| `.badge-*`        | Badges de colores semánticos             |
| `.label`          | Label de formulario                      |
| `.hint`           | Texto de ayuda bajo un input             |
| `.error-msg`      | Mensaje de error bajo un input           |
| `.nav-item-light` | Nav item para sidebar claro              |
| `.nav-item-dark`  | Nav item para sidebar oscuro             |
| `.divider`        | Línea divisora zinc-200                  |

---

*Leer BRANDING.md para tokens de color y tipografía.*
*Leer ROADMAP.md para orden de construcción y dependencias.*
