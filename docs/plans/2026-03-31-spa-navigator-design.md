# SPA Navigator — Diseño

> Fecha: 2026-03-31 · Estado: Aprobado

## Objetivo

Transformar el `index.html` en un SPA shell que permita navegar entre los 173 archivos (107 componentes + 66 páginas) sin recargar la página, con botones de descarga de código en los componentes N1–N6.

## Arquitectura

### Shell SPA (index.html)

El index.html actual se convierte en el shell:

- **Sidebar** (ya existe): 173 items organizados por nivel
- **Área de contenido** (`<main>`): carga dinámica via `fetch()`
- **Hash routing**: `#/src/components/n4-estado-reactivo/C47-table-headers.html`
- **Browser back/forward**: escuchar `hashchange`

### Flujo de carga

1. Click en sidebar link → `preventDefault()`
2. `fetch(href)` del archivo HTML
3. Parsear response: extraer contenido del `<body>` (sin `<script defer src="alpine">`, sin `<style>[x-cloak]`)
4. Extraer `<script>` tags inline (funciones nombradas Alpine)
5. Limpiar estado Alpine previo del `<main>`
6. Inyectar HTML en `<main>`, ejecutar scripts
7. Actualizar hash URL + active state sidebar
8. Scroll to top del área de contenido

### Botones de descarga

Solo para componentes en `src/components/n1..n6` (NO n7-shells, NO pages).

**Botón componente completo:**
- Se inyecta automáticamente después del `<header>` del componente
- Descarga el archivo `.html` original completo
- Icono de descarga + "Descargar componente"

**Botón por variante:**
- Se inyecta en esquina superior derecha de cada `<section>` del componente
- Extrae: HTML de la sección + scripts relacionados
- Genera archivo standalone: head mínimo + tailwind link + alpine CDN + contenido de la variante
- Nombre: `{componente}-variante-{n}.html`

### Gestión de Alpine.js

- Alpine se carga UNA VEZ en el shell (no en cada fetch)
- Antes de inyectar nuevo contenido: destruir instancias Alpine del `<main>` anterior
- Evaluar `<script>` inline para registrar funciones nombradas
- Inicializar Alpine en el nuevo contenido

### Lo que NO se modifica

- Los 173 archivos HTML existentes (siguen funcionando standalone)
- La estructura de carpetas `src/`
- Los estilos CSS (`main.css`, `components.css`)
- Las convenciones de Alpine.js

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `index.html` | Modificar: agregar lógica SPA, hash routing, fetch loader |
| `src/js/spa-router.js` | Crear: lógica de routing, fetch, parse, inject |
| `src/js/code-download.js` | Crear: lógica de descarga de código por componente y variante |

## Stack

- Vanilla JS (sin dependencias nuevas)
- Alpine.js 3 (ya incluido)
- Tailwind CSS v4 (ya incluido)
