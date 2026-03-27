# BRANDING.md — Sistema de Diseño LayoutOS
> Documento de contexto v1.0 · Aprobado · Solo diseño

---

## Filosofía

**Neutral pero expresivo.** Zinc como base estructural: suficientemente neutro para no competir con el contenido, pero con carácter suficiente para reconocer jerarquías claras.

**Un solo acento.** Azul como único color de acción. Simple, reconocible, profesional.

**Stack:** Tailwind CSS + Alpine.js · Progresivo · Agnóstico · Educativo

---

## Paleta de color

### Base estructural — Zinc

| Token             | Clase Tailwind   | Hex       | Uso principal                          |
|-------------------|------------------|-----------|----------------------------------------|
| `bg-page`         | `bg-zinc-50`     | `#FAFAFA` | Fondo de página / canvas               |
| `bg-surface`      | `bg-zinc-100`    | `#F4F4F5` | Superficies de componentes, sidebars   |
| `border-default`  | `border-zinc-200`| `#E4E4E7` | Divisores, bordes de cards e inputs    |
| `border-strong`   | `border-zinc-300`| `#D4D4D8` | Bordes en hover, separadores fuertes   |
| `text-muted`      | `text-zinc-400`  | `#A1A1AA` | Labels secundarios, placeholders       |
| `text-secondary`  | `text-zinc-600`  | `#52525B` | Texto de soporte, subtítulos           |
| `text-primary`    | `text-zinc-900`  | `#18181B` | Texto principal, títulos               |
| `bg-dark`         | `bg-zinc-950`    | `#09090B` | Sidebar oscuro, header de dashboard    |

### Acento — Blue (interacción y foco)

| Token              | Clase Tailwind    | Hex       | Uso principal                          |
|--------------------|-------------------|-----------|----------------------------------------|
| `accent-bg-subtle` | `bg-blue-50`      | `#EFF6FF` | Hover de items activos en nav          |
| `accent-bg-light`  | `bg-blue-100`     | `#DBEAFE` | Badges, highlights, selected state     |
| `accent-border`    | `border-blue-200` | `#BFDBFE` | Bordes de foco, input activo           |
| `accent-icon`      | `text-blue-500`   | `#3B82F6` | Iconos de acción, links                |
| `accent-primary`   | `bg-blue-600`     | `#2563EB` | Botones primarios, CTA                 |
| `accent-hover`     | `bg-blue-700`     | `#1D4ED8` | Hover de botones primarios             |

### Semánticos — Estado y feedback

| Rol          | Clase Tailwind     | Uso                                  |
|--------------|--------------------|--------------------------------------|
| `success`    | `text-emerald-600` / `bg-emerald-50` | Confirmaciones, publicado  |
| `warning`    | `text-amber-600`   / `bg-amber-50`   | Advertencias, pendiente    |
| `danger`     | `text-rose-600`    / `bg-rose-50`    | Errores, eliminación       |
| `info-alt`   | `text-violet-600`  / `bg-violet-50`  | Info alternativa, tips     |

> **Regla:** Los colores semánticos son solo para estados de UI, nunca como decoración.

---

## Tipografía

Fuente: **sistema nativo** (font-sans de Tailwind) — se reemplazará en etapas avanzadas si se decide customizar.

| Rol                  | Clases Tailwind                                        | Uso                              |
|----------------------|--------------------------------------------------------|----------------------------------|
| Hero / Display       | `text-3xl font-bold tracking-tight leading-tight`      | Títulos hero, landing            |
| Page Title / H1      | `text-2xl font-semibold tracking-tight`                | Título de página                 |
| Section Header / H2  | `text-xl font-semibold`                                | Encabezado de sección            |
| Card Title / H3      | `text-base font-semibold`                              | Título de card o panel           |
| Body                 | `text-sm font-normal leading-relaxed text-zinc-600`    | Párrafos y contenido             |
| Label / Overline     | `text-xs font-medium uppercase tracking-wide text-zinc-400` | Labels, overlines           |

---

## Espaciado

Base 4px (escala estándar de Tailwind).

| Token | Valor | Uso típico                            |
|-------|-------|---------------------------------------|
| `1`   | 4px   | Gap mínimo entre iconos y texto       |
| `2`   | 8px   | Padding interno de badges             |
| `3`   | 12px  | Gap entre items de lista              |
| `4`   | 16px  | Padding de inputs, gaps de formulario |
| `6`   | 24px  | Padding interno de cards              |
| `8`   | 32px  | Separación entre secciones menores    |
| `10`  | 40px  | Altura de navbar / header             |
| `12`  | 48px  | Padding de secciones de contenido     |
| `16`  | 64px  | Separación entre secciones mayores    |
| `20`  | 80px  | Padding de hero sections              |

---

## Border Radius

| Token       | Clase Tailwind  | Valor  | Uso                               |
|-------------|-----------------|--------|-----------------------------------|
| `sm`        | `rounded`       | 4px    | Tags pequeños, chips              |
| `md`        | `rounded-lg`    | 8px    | Inputs, botones                   |
| `lg`        | `rounded-xl`    | 12px   | Cards, panels                     |
| `xl`        | `rounded-2xl`   | 16px   | Modales, drawers                  |
| `full`      | `rounded-full`  | 9999px | Avatares, badges pill, toggles    |

---

## Sistema de sombras

| Token    | CSS                                                                 | Uso                    |
|----------|---------------------------------------------------------------------|------------------------|
| `xs`     | `shadow-sm` → `0 1px 2px rgba(0,0,0,.06)`                          | Inputs, fields         |
| `sm`     | `shadow` → `0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)` | Cards estáticas        |
| `md`     | `shadow-md` → `0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.05)` | Cards en hover      |
| `lg`     | `shadow-lg` → `0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05)` | Dropdowns          |
| `xl`     | `shadow-xl` → `0 20px 25px rgba(0,0,0,.08), 0 8px 10px rgba(0,0,0,.05)` | Modales           |

---

## Capas de elevación (z-index)

| Capa  | z-index | Elemento                    | Sombra   |
|-------|---------|-----------------------------|----------|
| Z-0   | —       | Page background (`zinc-50`) | ninguna  |
| Z-1   | —       | Cards / Panels (`white`)    | `sm`     |
| Z-2   | `z-10`  | Dropdowns / Popovers        | `lg`     |
| Z-3   | `z-20`  | Modales / Overlays          | `xl`     |
| Z-4   | `z-30`  | Toasts / Notifications      | `xl`     |
| Z-5   | `z-50`  | Sidebar móvil / Drawer      | `xl`     |

---

## Microinteracciones

### Durations

| Valor  | Clase Tailwind       | Uso                              |
|--------|----------------------|----------------------------------|
| 75ms   | `duration-75`        | Feedback instantáneo (ripple)    |
| 150ms  | `duration-150`       | Hover states, color transitions  |
| 200ms  | `duration-200`       | Transiciones de color            |
| 300ms  | `duration-300`       | Entrada/salida de elementos      |
| 500ms  | `duration-500`       | Page transitions, slide panels   |

### Easing

| Uso                    | Clase Tailwind   | Descripción                      |
|------------------------|------------------|----------------------------------|
| Aparición de UI        | `ease-out`       | Empieza rápido, frena suave      |
| Desaparición           | `ease-in`        | Empieza suave, termina rápido    |
| Toggle / switch        | `ease-in-out`    | Simétrico                        |

### Hover — reglas base

```
bg:     hover:bg-zinc-50  →  hover:bg-zinc-100
border: hover:border-zinc-300
card:   hover:-translate-y-px  hover:shadow-md
link:   hover:text-blue-600
```

### Focus — reglas base

```
input activo:  focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 focus:border-blue-400
input error:   focus:ring-2 focus:ring-rose-200 focus:border-rose-400
```

### Active / Click

```
button: active:scale-95  transition-transform duration-75
```

---

## Componentes base — clases de referencia

### Botones

```html
<!-- Primario -->
<button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150">
  Acción primaria
</button>

<!-- Secundario -->
<button class="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150">
  Secundario
</button>

<!-- Ghost -->
<button class="text-blue-600 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150">
  Ghost
</button>
```

### Badges

```html
<span class="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Activo</span>
<span class="bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-0.5 rounded-full">Publicado</span>
<span class="bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-0.5 rounded-full">Pendiente</span>
<span class="bg-rose-50 text-rose-600 text-xs font-medium px-2.5 py-0.5 rounded-full">Error</span>
<span class="bg-zinc-100 text-zinc-600 text-xs font-medium px-2.5 py-0.5 rounded-full">Draft</span>
```

### Inputs

```html
<input
  class="w-full border border-zinc-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-150"
  type="text" placeholder="Escribe aquí..."
/>
```

### Cards

```html
<div class="bg-white border border-zinc-200 rounded-xl shadow p-6 hover:shadow-md hover:-translate-y-px transition-all duration-200">
  <!-- contenido -->
</div>
```

---

## Sidebar / Nav — variantes

### Dark sidebar (dashboards)
```
bg-zinc-950  text-zinc-300
item activo:  bg-blue-600  text-white
item hover:   bg-zinc-800  text-white
```

### Light sidebar (apps)
```
bg-zinc-100  text-zinc-700  border-r border-zinc-200
item activo:  bg-blue-50  text-blue-700  font-medium
item hover:   bg-zinc-200
```

---

*Este documento es la fuente de verdad de diseño para LayoutOS.*
*Cualquier cambio debe actualizarse aquí antes de implementarse en código.*
