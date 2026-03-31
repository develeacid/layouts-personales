# N8 · Charts — Diseño

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans para crear el plan de implementación basado en este diseño.

**Goal:** Crear un catálogo educativo de gráficas (N8) usando Apache ECharts + Alpine.js, organizado por complejidad de estructura de datos, con tablas editables y descarga standalone.

**Librería:** Apache ECharts 5 via CDN
**Extensión:** echarts-stat (solo C115, para regresión)
**Ubicación:** `src/components/n8-charts/`
**Nomenclatura:** C108–C117

---

## Arquitectura

### Stack
- **ECharts 5** — `https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js`
- **echarts-stat** — `https://cdn.jsdelivr.net/npm/echarts-stat/dist/ecStat.min.js` (solo C115)
- **Alpine.js 3** — gestión de estado reactivo (`x-data`)
- **Tailwind CSS v4** — estilos

### Patrón base Alpine ↔ ECharts

Todos los componentes C108–C117 siguen este patrón:

```js
function chartComponent() {
  return {
    data: [ /* estructura según nivel */ ],
    chart: null,
    _resizeHandler: null,

    init() {
      this.chart = echarts.init(this.$refs.chart);
      this.render();

      // Deep watch — detecta cambios dentro de objetos (x-model en inputs)
      this.$watch('data', () => this.render(), { deep: true });

      // Responsividad — redimensionar canvas al cambiar ventana
      this._resizeHandler = () => this.chart.resize();
      window.addEventListener('resize', this._resizeHandler);
    },

    // Cleanup — liberar instancia y listener al destruir componente
    destroy() {
      window.removeEventListener('resize', this._resizeHandler);
      this.chart.dispose();
    },

    render() {
      this.chart.setOption({ /* config ECharts */ });
    }
  }
}
```

### Estructura de cada componente

```
┌─────────────────────────────────────────────┐
│ Header: "C108 · Line Chart"                 │
│ Subtítulo: "Nivel 1 · Estructura plana"     │
├─────────────────────────────────────────────┤
│ Section "Variante 1 — Simple"               │
│                                             │
│  ┌─ Estructura de datos ──────────────────┐ │
│  │ Explicación del x-data y su estructura │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌─ Tabla fuente (editable con x-model) ──┐ │
│  │  Mes    │ Ventas                       │ │
│  │  Enero  │ [150]  ← input editable      │ │
│  │  Feb    │ [200]  ← input editable      │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌─ Gráfica (reactiva a la tabla) ────────┐ │
│  │         📈                             │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Section "Variante 2 — Con área"             │
│  ...misma estructura...                     │
└─────────────────────────────────────────────┘
```

---

## Componentes

### Nivel 1 · Estructura Plana — `[{ label, value }]`

| # | Componente | Variantes |
|---|-----------|-----------|
| C108 | Line Chart | Simple, con área, múltiples series, con zoom |
| C109 | Bar Chart | Vertical, horizontal, stacked, con etiquetas |
| C110 | Pie / Donut | Pie básico, donut, con leyenda, nightingale (rose) |

**Casos de uso:** Ventas mensuales, distribución de tráfico, comparativas por categoría.

### Nivel 2 · Multiatributo — objetos con múltiples claves numéricas

| # | Componente | Estructura | Variantes |
|---|-----------|-----------|-----------|
| C111 | Gauge | `{ value, min, max, ranges[] }` | Simple, multi-anillo, con rangos de color, dashboard |
| C112 | Radar | `[{ entity, attr1, attr2, ... }]` | Simple, múltiples entidades, con relleno, personalizado |
| C113 | Candlestick | `[{ date, O, H, L, C }]` | OHLC básico, con volumen, con media móvil, con zoom |

**Casos de uso:** KPIs con umbral, comparación multidimensional de productos, trading financiero.

### Nivel 3 · Estadística Avanzada — distribuciones y correlaciones

| # | Componente | Estructura | Variantes | CDN extra |
|---|-----------|-----------|-----------|-----------|
| C114 | Boxplot | `[[obs1, obs2, ...], ...]` | Básico, comparativo, horizontal, con scatter superpuesto | — |
| C115 | Scatter + Regresión | `[[x, y], ...]` | Simple, regresión lineal, regresión polinomial, con clusters | echarts-stat |
| C116 | Heatmap | `[[idxX, idxY, val], ...]` | Básica, con etiquetas, estilo calendario, matriz de correlación | — |

**Casos de uso:**
- **Boxplot:** Tiempos de respuesta de API por endpoint, distribución de salarios por departamento, rendimiento de queries a DB.
- **Scatter:** m² vs precio inmuebles, presupuesto marketing vs registros, tiempo en plataforma vs feature adoption.
- **Heatmap:** Día×Hora de volumen de tickets (planificar turnos), Módulo×Mes de bugs (detectar deuda técnica).

**Notas técnicas:**
- ECharts 5 tiene `dataset.transform: 'boxplot'` nativo — calcula Q1, mediana, Q3, whiskers automáticamente.
- echarts-stat provee `transform: { type: 'ecStat:regression' }` para líneas de tendencia.
- Heatmap requiere `visualMap` para mapear valores → colores.

### Nivel 4 · Multivariada — múltiples dimensiones simultáneas

| # | Componente | Estructura | Variantes |
|---|-----------|-----------|-----------|
| C117 | Parallel Coordinates | `[[dim1, dim2, dim3, ...], ...]` | Básica, con brushing interactivo, con colores por categoría, con highlight al hover |

**Casos de uso:** Comparar candidatos en hiring (6+ dimensiones), comparar servidores para migración (CPU, RAM, latencia, costo, uptime), especificaciones técnicas de autos.

**Notas técnicas:** `parallelAxis` maneja normalización de escalas distintas. Brushing interactivo viene gratis con `parallel` series type.

---

## Sistema de descarga

### Cambio requerido: extraer CDNs externos en parseBody

Modificar `spa-router.js` para que `parseBody` también extraiga URLs de scripts externos:

```js
const cdns = [];
doc.querySelectorAll('script[src]').forEach(s => {
  if (!s.src.includes('alpinejs')) {
    cdns.push(s.src);
  }
});
return { html, scripts, styles, cdns };
```

### Flujo de datos actualizado

```
parseBody → { html, scripts, styles, cdns }
     ↓
loadRoute → injectDownloadButtons(main, path, text, parsed.scripts, parsed.styles, parsed.cdns)
     ↓
buildVariantFile → incluye CDNs + scripts inline + Alpine
```

### HTML generado para variante

```html
<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8" />
  <title>LayoutOS · componente — variante</title>
  <style>/* CSS inline */</style>
</head>
<body class="h-full bg-page antialiased">
  <div class="max-w-5xl mx-auto px-6 py-16">
    <!-- contenido de la variante -->
  </div>
  <!-- CDNs detectados del componente original -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
  <!-- Scripts inline (funciones Alpine) -->
  <script>function chartComponent() { ... }</script>
  <!-- Alpine siempre al final -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
```

Genérico: cualquier CDN futuro se incluye automáticamente sin tocar code-download.js.

---

## Sidebar

Nueva sección en `index.html` después de N7:

```
N8 · Charts
├── C108 · Line Chart
├── C109 · Bar Chart
├── C110 · Pie / Donut
├── C111 · Gauge
├── C112 · Radar
├── C113 · Candlestick
├── C114 · Boxplot
├── C115 · Scatter + Regresión
├── C116 · Heatmap
└── C117 · Parallel Coordinates
```
