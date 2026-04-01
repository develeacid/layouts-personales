# BRANDING-DARK.md — Tema Oscuro LayoutOS
> Documento de contexto v1.0 · Complemento de BRANDING.md

---

## Filosofia

El tema oscuro invierte la jerarquia de luminosidad del tema claro, manteniendo la misma paleta Zinc y el mismo acento Blue. Los colores semanticos conservan su tono pero se adaptan en luminosidad para mantener contraste sobre fondos oscuros.

**Regla:** Cada token del tema claro tiene un equivalente oscuro. La estructura, tipografia, espaciado y microinteracciones no cambian.

---

## Paleta de color — Tema Oscuro

### Base estructural — Zinc (invertida)

| Token Light         | Clase Light      | Hex Light | Token Dark          | Clase Dark       | Hex Dark  | Uso                                    |
|---------------------|------------------|-----------|---------------------|------------------|-----------|----------------------------------------|
| `bg-page`           | `bg-zinc-50`     | `#FAFAFA` | `bg-page-dark`      | `bg-zinc-950`    | `#09090B` | Fondo de pagina / canvas               |
| `bg-surface`        | `bg-zinc-100`    | `#F4F4F5` | `bg-surface-dark`   | `bg-zinc-900`    | `#18181B` | Superficies, sidebars, cards           |
| `bg-white` (cards)  | `bg-white`       | `#FFFFFF` | `bg-card-dark`      | `bg-zinc-900`    | `#18181B` | Cards, panels, inputs                  |
| `bg-elevated`       | `bg-zinc-200`    | `#E4E4E7` | `bg-elevated-dark`  | `bg-zinc-800`    | `#27272A` | Elementos elevados, hovers             |
| `border-default`    | `border-zinc-200`| `#E4E4E7` | `border-dark`       | `border-zinc-800`| `#27272A` | Divisores, bordes de cards e inputs    |
| `border-strong`     | `border-zinc-300`| `#D4D4D8` | `border-strong-dark`| `border-zinc-700`| `#3F3F46` | Bordes en hover, separadores fuertes   |
| `text-muted`        | `text-zinc-400`  | `#A1A1AA` | `text-muted-dark`   | `text-zinc-500`  | `#71717A` | Labels secundarios, placeholders       |
| `text-secondary`    | `text-zinc-600`  | `#52525B` | `text-secondary-dark`| `text-zinc-400` | `#A1A1AA` | Texto de soporte, subtitulos           |
| `text-primary`      | `text-zinc-900`  | `#18181B` | `text-primary-dark` | `text-zinc-100`  | `#F4F4F5` | Texto principal, titulos               |

### Acento — Blue (sin cambios de tono, ajuste de luminosidad)

| Token Light          | Clase Light       | Hex       | Token Dark             | Clase Dark        | Hex       | Uso                                    |
|----------------------|-------------------|-----------|------------------------|-------------------|-----------|-----------------------------------------|
| `accent-bg-subtle`   | `bg-blue-50`      | `#EFF6FF` | `accent-bg-subtle-dark`| `bg-blue-950`     | `#172554` | Hover de items activos en nav           |
| `accent-bg-light`    | `bg-blue-100`     | `#DBEAFE` | `accent-bg-light-dark` | `bg-blue-900`     | `#1E3A5F` | Badges, highlights, selected state      |
| `accent-border`      | `border-blue-200` | `#BFDBFE` | `accent-border-dark`   | `border-blue-800` | `#1E40AF` | Bordes de foco, input activo            |
| `accent-icon`        | `text-blue-500`   | `#3B82F6` | `accent-icon-dark`     | `text-blue-400`   | `#60A5FA` | Iconos de accion, links                 |
| `accent-primary`     | `bg-blue-600`     | `#2563EB` | `accent-primary-dark`  | `bg-blue-600`     | `#2563EB` | Botones primarios (sin cambio)          |
| `accent-hover`       | `bg-blue-700`     | `#1D4ED8` | `accent-hover-dark`    | `bg-blue-500`     | `#3B82F6` | Hover de botones primarios              |

### Semanticos — Adaptados para fondo oscuro

| Rol          | Light bg          | Light text         | Dark bg           | Dark text          |
|--------------|-------------------|--------------------|-------------------|--------------------|
| `success`    | `bg-emerald-50`   | `text-emerald-600` | `bg-emerald-950`  | `text-emerald-400` |
| `warning`    | `bg-amber-50`     | `text-amber-600`   | `bg-amber-950`    | `text-amber-400`   |
| `danger`     | `bg-rose-50`      | `text-rose-600`    | `bg-rose-950`     | `text-rose-400`    |
| `info-alt`   | `bg-violet-50`    | `text-violet-600`  | `bg-violet-950`   | `text-violet-400`  |

---

## Sombras — Tema Oscuro

En fondos oscuros las sombras necesitan mayor opacidad para ser visibles.

| Token    | CSS Dark                                                                  |
|----------|---------------------------------------------------------------------------|
| `xs`     | `0 1px 2px rgba(0,0,0,.20)`                                              |
| `sm`     | `0 1px 3px rgba(0,0,0,.30), 0 1px 2px rgba(0,0,0,.20)`                   |
| `md`     | `0 4px 6px rgba(0,0,0,.30), 0 2px 4px rgba(0,0,0,.20)`                   |
| `lg`     | `0 10px 15px rgba(0,0,0,.30), 0 4px 6px rgba(0,0,0,.20)`                 |
| `xl`     | `0 20px 25px rgba(0,0,0,.30), 0 8px 10px rgba(0,0,0,.20)`                |

---

## Sidebar / Nav — Tema Oscuro

### Sidebar (siempre dark en ambos temas)
```
bg-zinc-950  text-zinc-300
item activo:  bg-blue-500/10  text-blue-400
item hover:   bg-zinc-800/50  text-zinc-200
```

### Header / Footer (se adaptan al tema)
```
Light:  bg-white  border-zinc-200  text-zinc-900
Dark:   bg-zinc-900  border-zinc-800  text-zinc-100
```

---

## Scrollbar — Tema Oscuro

```
thumb: bg-zinc-700 (idle) → bg-zinc-600 (hover)
track: transparent
```

---

## Implementacion

El tema oscuro se activa agregando la clase `dark` al elemento `<html>`. Actualmente se usan CSS overrides temporales en `src/css/main.css` que mapean las clases mas usadas a sus equivalentes oscuros.

**Plan de migracion:**
1. **Fase actual:** CSS overrides globales (`html.dark .bg-white { ... }`)
2. **Fase siguiente:** Agregar clases `dark:` de Tailwind a cada componente
3. **Fase final:** Eliminar los overrides temporales cuando todos los componentes tengan clases `dark:`

---

*Este documento complementa BRANDING.md con los parametros del tema oscuro.*
*Ambos documentos juntos son la fuente de verdad de diseño para LayoutOS.*
