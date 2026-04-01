# Integración de gráficas ECharts en dashboards N7 — Diseño

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans para crear el plan de implementación basado en este diseño.

**Goal:** Agregar una gráfica ECharts a cada dashboard N7 (P50-P60, excepto P58) como sección nueva, usando datos existentes del x-data o series generadas.

**Patrón técnico:** Cada dashboard ya tiene una función Alpine. Se agrega ECharts CDN, chartBase mixin, datos de chart, y una nueva sección HTML con x-ref="chart". Instancia ECharts almacenada en DOM element (patrón `_ec`).

---

## Mapa de gráficas

| Dashboard | Gráfica | Tipo ECharts | Datos fuente |
|-----------|---------|-------------|-------------|
| P50 · Dashboard Base | Ventas mensuales (reemplaza placeholder dashed) | Line con área | Serie 12 meses generada |
| P51 · SaaS | Distribución de planes | Pie donut | plans[] existente |
| P52 · E-commerce | Top 5 productos por ventas | Bar horizontal | topProducts[] existente |
| P53 · Marketing | Fuentes de tráfico | Pie | trafficSources[] existente |
| P54 · Car Service | Estado de vehículos | Gauge multi | KPIs existentes |
| P55 · Logistics | Estados de envío | Pie donut | KPIs existentes |
| P56 · Bank | Gastos vs ingresos 6 meses | Line multi-series | Serie generada |
| P57 · Crypto | Candlestick trading (reemplaza placeholder dashed) | Candlestick con zoom | Serie 20 días generada |
| P59 · Projects | Progreso de milestones | Bar horizontal | milestones[] existente |
| P60 · Customer Service | Tickets por prioridad | Pie | Derivado de priorityTickets[] |

P58 (Music) excluido — es reproductor, no tiene datos para visualizar.

## Patrón de integración

1. Agregar `<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>` antes del script inline
2. Dentro de la función Alpine existente, agregar: initChart(), renderChart(), _resizeHandler
3. Almacenar instancia en `this.$refs.chart._ec` (evita Alpine Proxy)
4. Nueva `<section>` con `x-ref="chart"` y `x-init="initChart()"`
5. Para P50 y P57: reemplazar el div placeholder dashed existente con la gráfica
