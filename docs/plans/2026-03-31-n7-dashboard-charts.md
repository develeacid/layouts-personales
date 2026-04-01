# N7 Dashboard Charts Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Agregar una gráfica ECharts a cada dashboard N7 (P50-P60, excepto P58) como sección nueva.

**Architecture:** Cada dashboard tiene una función Alpine existente. Se agrega ECharts CDN, métodos initChart()/renderChart(), y una nueva sección HTML. Instancia ECharts en DOM element (patrón `_ec`). Colores del branding Tailwind del proyecto.

**Tech Stack:** Apache ECharts 5 (CDN), Alpine.js 3, Tailwind CSS v4

---

### Task 1: P50 — Line con área (reemplaza placeholder)
### Task 2: P51 — Pie donut (distribución de planes)
### Task 3: P52 — Bar horizontal (top productos)
### Task 4: P53 — Pie (fuentes de tráfico)
### Task 5: P54 — Gauge (estado vehículos)
### Task 6: P55 — Pie donut (estados envío)
### Task 7: P56 — Line multi-series (gastos vs ingresos)
### Task 8: P57 — Candlestick (reemplaza placeholder trading)
### Task 9: P59 — Bar horizontal (milestones)
### Task 10: P60 — Pie (tickets por prioridad)
