# ROADMAP.md — Ruta de aprendizaje LayoutOS
> Componentes + Páginas ordenados por dificultad progresiva
> Stack: Tailwind CSS + Alpine.js · v2.0

---

## Criterios de clasificación

| Nivel | Nombre                  | ¿Qué introduce?                                              |
|-------|-------------------------|--------------------------------------------------------------|
| 1     | Fundamentos estáticos   | HTML semántico, Tailwind puro, sin interactividad            |
| 2     | Layout estructural      | Flexbox, Grid, secciones compuestas, responsive              |
| 3     | Alpine básico           | `x-data`, `x-show`, `@click`, transiciones, toggles         |
| 4     | Estado reactivo         | Formularios, filtros, tablas, `x-model`, validación          |
| 5     | Patrones CRUD           | Modales, drawers, confirmaciones, feedback multi-paso        |
| 6     | Interactividad avanzada | Drag & drop, calendario, chat, editor, AI inputs             |
| 7     | Composición completa    | Dashboard shells, layouts compuestos, comunicación cruzada   |

> **Regla:** Los componentes se construyen primero. Las páginas ensamblan componentes ya hechos.

---

## PARTE 1 — COMPONENTES

---

### Nivel 1 — Fundamentos estáticos
> Sin Alpine.js. Solo HTML + Tailwind. Aprende: espaciado, tipografía, colores, flex básico.

| #   | Componente           | Origen          | Enfoque de aprendizaje                          |
|-----|----------------------|-----------------|------------------------------------------------|
| C01 | Banners              | Marketing UI    | Componente simple, colores semánticos, flex    |
| C02 | Customer Logos       | Marketing UI    | Grid, gap, imágenes / placeholders             |
| C03 | Newsletter Sections  | Marketing UI    | Input + botón, layout centrado                 |
| C04 | CTA Sections         | Marketing UI    | Tipografía grande, contraste, botones          |
| C05 | Social Proof         | Marketing UI    | Números, texto destacado, layout horizontal    |
| C06 | Cookie Consent       | Marketing UI    | Barra fija, botones, z-index                   |
| C07 | KPI Stat Cards       | nuevo           | Metric cards: número, label, delta, icono      |
| C08 | Status Indicators    | nuevo           | Pills de estado: colores semánticos, dot       |
| C09 | Avatares & Grupos    | nuevo           | Avatar solo, con badge, stack de grupo         |
| C10 | Empty States         | nuevo           | Ilustración + mensaje + CTA cuando no hay data |
| C11 | Breadcrumbs          | nuevo           | Nav trail estático, separadores, último activo |

---

### Nivel 2 — Layout estructural
> Sin Alpine.js. Grid complejo, responsive, secciones completas.

| #   | Componente           | Origen          | Enfoque de aprendizaje                          |
|-----|----------------------|-----------------|------------------------------------------------|
| C12 | Hero Sections        | Marketing UI    | Layout hero: texto + imagen, responsive         |
| C13 | Feature Sections     | Marketing UI    | Grid de features, iconos, descripciones         |
| C14 | Content Sections     | Marketing UI    | Texto + media, alternancia izq/der              |
| C15 | Headers              | Marketing UI    | Navbar estática: logo, links, botón             |
| C16 | Footer Sections      | Marketing UI    | Footer multi-columna, links, legal              |
| C17 | Team Sections        | Marketing UI    | Grid de cards de personas, avatares             |
| C18 | Blog Sections        | Marketing UI    | Grid de artículos, meta información             |
| C19 | Testimonials         | Marketing UI    | Quotes, avatares, estrellas rating              |
| C20 | FAQ Sections         | Marketing UI    | Lista de preguntas (aún estática)               |
| C21 | Pricing Tables       | Marketing UI    | Columnas de planes, features, badges            |
| C22 | Project Portfolio    | Marketing UI    | Grid de proyectos, imágenes, tags               |
| C23 | Event Schedule       | Marketing UI    | Lista de eventos, fechas, horas                 |
| C24 | Storefront Hero      | E-commerce UI   | Hero con producto destacado                     |
| C25 | Product Categories   | E-commerce UI   | Grid de categorías, imágenes, links             |
| C26 | Related Articles     | Publisher UI    | Cards de artículos relacionados                 |
| C27 | Activity Feed        | nuevo           | Timeline vertical: acción, usuario, tiempo      |
| C28 | Server Status Panel  | nuevo           | Indicadores de servicios activos/caídos         |
| C29 | Integration Cards    | nuevo           | Card con logo, descripción, estado connect      |
| C30 | Invoice Template     | nuevo           | Layout de factura: cabecera, items, totales     |
| C31 | File Browser Row     | nuevo           | Fila de archivo: icono, nombre, meta, acciones  |

---

### Nivel 3 — Alpine.js básico
> Introduce Alpine.js. `x-data`, `x-show`, `x-bind`, `@click`, transiciones.

| #   | Componente             | Origen          | Enfoque de aprendizaje                          |
|-----|------------------------|-----------------|------------------------------------------------|
| C32 | Headers interactivos   | Marketing UI    | Menú hamburguesa mobile con x-show              |
| C33 | Side Navigations       | Application UI  | Sidebar colapsable, active state, submenús      |
| C34 | Dashboard Navbars      | Application UI  | Navbar con dropdown de usuario y notificaciones |
| C35 | E-commerce Navbars     | E-commerce UI   | Navbar con carrito, búsqueda, categorías        |
| C36 | FAQ Accordion          | Marketing UI    | Accordion: x-data, @click, x-show + animate     |
| C37 | Popups / Modales base  | Marketing UI    | Modal: overlay, escape key, focus trap          |
| C38 | Discount Popups        | E-commerce UI   | Popup con delay, cierre, localStorage guard     |
| C39 | Banners dismissibles   | Marketing UI    | x-data con x-show, persist en localStorage      |
| C40 | Dropdown Filters       | Application UI  | Filtros en dropdown, selección múltiple         |
| C41 | Tabs                   | nuevo           | Tab switching: x-data, active state, content    |
| C42 | Notification Panel     | nuevo           | Panel deslizable: lista, read/unread, clear all |
| C43 | Tooltip                | nuevo           | Hover tooltip: posición, delay, contenido       |
| C44 | Toggle / Switch        | nuevo           | x-model toggle, labeled, disabled state         |
| C45 | Toast System           | nuevo           | Toasts apilables: tipos, auto-dismiss, queue    |
| C46 | Command Palette        | nuevo           | Overlay Cmd+K: búsqueda, resultados, acciones   |

---

### Nivel 4 — Estado reactivo
> `x-model`, validación, tablas dinámicas, búsqueda, paginación.

| #   | Componente              | Origen          | Enfoque de aprendizaje                          |
|-----|-------------------------|-----------------|------------------------------------------------|
| C47 | Table Headers           | Application UI  | Encabezados con sort, columnas fijas            |
| C48 | Advanced Tables         | Application UI  | Sort, filtro, checkbox bulk, paginación         |
| C49 | Table Footers           | Application UI  | Paginación, contador de resultados              |
| C50 | Faceted Search Modals   | Application UI  | Filtros combinados: rango, select, checkbox     |
| C51 | Faceted Search Drawers  | Application UI  | Mismos filtros pero en drawer lateral           |
| C52 | Blog Templates          | Publisher UI    | Layout de artículo completo: TOC, lectura       |
| C53 | Comments Sections       | Publisher UI    | Lista de comentarios, replies, likes            |
| C54 | Contact Forms           | Marketing UI    | Formulario completo: validación, feedback       |
| C55 | Register Forms          | Marketing UI    | Registro: validación, estados de error          |
| C56 | Login Forms             | Marketing UI    | Login: toggle password, remember me             |
| C57 | Reset Password Forms    | Marketing UI    | Flujo de recuperación en pasos                  |
| C58 | Date Picker             | nuevo           | Selector de fecha: mes, navegar, selección       |
| C59 | File Upload Zone        | nuevo           | Drag & drop de archivos, preview, progress      |
| C60 | Multi-select Tags Input | nuevo           | Input de tags: agregar, eliminar, sugerir       |
| C61 | Range Slider            | nuevo           | Slider de rango: min/max, valor reactivo        |
| C62 | Code Block              | nuevo           | Bloque de código: syntax highlight, copy button  |
| C63 | OTP Input               | nuevo           | 6 campos: auto-focus, paste, backspace          |
| C64 | API Key Card            | nuevo           | Mostrar/ocultar key, copiar, revocar, fecha     |
| C65 | Progress Steps          | nuevo           | Stepper: completed, current, upcoming, con nav  |

---

### Nivel 5 — Patrones CRUD
> Modales completos, drawers, confirmaciones destructivas, feedback.

| #   | Componente              | Origen          | Enfoque de aprendizaje                          |
|-----|-------------------------|-----------------|------------------------------------------------|
| C66 | Create Forms (CRUD)     | Application UI  | Formulario de creación con validación           |
| C67 | Update Forms (CRUD)     | Application UI  | Formulario precargado con datos existentes      |
| C68 | Read Sections (CRUD)    | Application UI  | Vista de detalle: campos, estados, acciones     |
| C69 | CRUD Layouts            | Application UI  | Shell: lista + detalle + barra de acciones      |
| C70 | Create Modals (CRUD)    | Application UI  | Modal de creación: foco, validación, submit     |
| C71 | Update Modals (CRUD)    | Application UI  | Modal de edición con datos precargados          |
| C72 | Read Modals (CRUD)      | Application UI  | Modal de lectura, solo visualización            |
| C73 | Delete Confirm (CRUD)   | Application UI  | Confirmación destructiva: texto de seguridad    |
| C74 | Success Message (CRUD)  | Application UI  | Toast / banner de éxito post-acción             |
| C75 | Read Drawers (CRUD)     | Application UI  | Drawer lateral de detalle                       |
| C76 | Update Drawers (CRUD)   | Application UI  | Drawer de edición con formulario                |
| C77 | Create Drawers (CRUD)   | Application UI  | Drawer de creación con validación               |
| C78 | Kanban Card             | nuevo           | Card arrastrable: prioridad, asignee, tags      |
| C79 | Kanban Column           | nuevo           | Columna: header, contador, drop zone, add card  |
| C80 | Chat Bubble             | nuevo           | Mensaje: sent/received, avatar, timestamp       |
| C81 | Chat Input              | nuevo           | Textarea: expand, emoji, attach, send           |
| C82 | Email List Item         | nuevo           | Fila de inbox: read/unread, estrella, preview   |
| C83 | Email Viewer            | nuevo           | Cuerpo de email: header, contenido, adjuntos    |
| C84 | Calendar Grid           | nuevo           | Mes estático: celdas, evento chips, hoy         |
| C85 | Video Participant Tile  | nuevo           | Tile: avatar, nombre, mic/cam status            |

---

### Nivel 6 — Interactividad avanzada
> Drag & drop, calendarios interactivos, editor, AI, comunicaciones.

| #   | Componente              | Origen          | Enfoque de aprendizaje                          |
|-----|-------------------------|-----------------|------------------------------------------------|
| C86 | Product Cards           | E-commerce UI   | Card: imagen, precio, badge, CTA, favorito      |
| C87 | Product Overview        | E-commerce UI   | Detalle: galería, variantes, stock, add to cart |
| C88 | Product Information     | E-commerce UI   | Tabs: descripción, specs, envío                 |
| C89 | Product Reviews         | E-commerce UI   | Reviews: estrellas, filtros, paginación         |
| C90 | Promotional Sections    | E-commerce UI   | Banners de oferta, countdown timer reactivo     |
| C91 | Shopping Cart           | E-commerce UI   | Carrito: cantidad reactiva, eliminar, subtotal  |
| C92 | Order Summary           | E-commerce UI   | Resumen: items, cupón, total reactivo           |
| C93 | Payment Forms           | E-commerce UI   | Pago: tarjeta, validación, estados              |
| C94 | Kanban Board completo   | nuevo           | Board: drag between columns, persist state      |
| C95 | Calendar interactivo    | nuevo           | Mes/semana/día: eventos, click, drag            |
| C96 | Chat Room               | nuevo           | Lista canales + mensajes + input + presencia    |
| C97 | AI Prompt Input         | nuevo           | Textarea: model selector, params, submit        |
| C98 | AI Response Bubble      | nuevo           | Output: streaming text, copy, regenerate        |
| C99 | Rich Text Toolbar       | nuevo           | Formatting bar: bold, italic, lists, links      |
| C100| Call Controls Bar       | nuevo           | Barra: mute, cam, share, end call              |
| C101| Video Grid Layout       | nuevo           | Grid de tiles: 1, 2, 4, 6, 9 participantes     |

---

### Nivel 7 — Shells y composición
> Application shells completos, layouts de página, navegación profunda.

| #   | Componente              | Origen          | Enfoque de aprendizaje                          |
|-----|-------------------------|-----------------|------------------------------------------------|
| C102| Application Shells      | Application UI  | Shell: sidebar + header + content area + footer |
| C103| Dashboard Navbars full  | Application UI  | Navbar completa: todos los estados y dropdowns  |
| C104| Dashboard Footers       | Application UI  | Footer de app: links, versión, status           |
| C105| Mega Footers            | E-commerce UI   | Footer complejo: multi-columna, newsletter      |
| C106| Sidebar anidado         | nuevo           | Sidebar con grupos, submenús, collapse, badges  |
| C107| Page Header             | nuevo           | Header de sección: título, breadcrumb, acciones |

---

## PARTE 2 — PÁGINAS

> Las páginas ensamblan componentes ya construidos.
> El nivel indica qué componentes necesita — construir primero ese nivel.

---

### Páginas Nivel 2 — Solo layout

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P01 | 404 Not Found           | C04, C10                                              |
| P02 | 500 Server Error        | C04, C08, C10                                         |
| P03 | Maintenance             | C04, C08, C10                                         |
| P04 | Server Status           | C08, C27, C28                                         |
| P05 | Sign In                 | C15, C56 estático                                     |
| P06 | Sign Up                 | C15, C55 estático                                     |
| P07 | Forgot Password         | C57 estático                                          |

---

### Páginas Nivel 3 — Alpine básico

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P08 | Reset Password          | C57, C63, C45                                         |
| P09 | Two Factor Auth         | C63, C45, C44                                         |
| P10 | Profile Lock            | C09, C56, C41                                         |
| P11 | Notifications           | C42, C08, C44, C33                                    |
| P12 | Pricing                 | C21, C44 toggle mensual/anual, C45                    |

---

### Páginas Nivel 4 — Estado reactivo

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P13 | Users Page              | C47, C48, C49, C09, C08, C40                          |
| P14 | User Settings           | C41, C55, C56, C44, C59                               |
| P15 | User Profile            | C09, C27, C41, C08                                    |
| P16 | Activity Feed           | C27, C09, C41, C08                                    |
| P17 | Products Page           | C86, C47, C48, C40, C50                               |
| P18 | Billing Page            | C07, C30, C41, C08                                    |
| P19 | Invoices Page           | C47, C48, C49, C08, C70                               |
| P20 | Transactions Page       | C47, C48, C49, C40, C08                               |
| P21 | Events                  | C23, C41, C40, C08, C70                               |
| P22 | Integrations            | C29, C44, C42, C45                                    |
| P23 | API Keys                | C64, C73, C45, C70                                    |
| P24 | Support Tickets         | C47, C48, C82, C08, C40                               |

---

### Páginas Nivel 5 — CRUD y flows complejos

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P25 | View Invoice            | C30, C09, C08, C75                                    |
| P26 | Create Invoice          | C66, C60, C58, C45                                    |
| P27 | View Transaction        | C75, C08, C27, C09                                    |
| P28 | View Ticket             | C75, C83, C81, C80, C09                               |
| P29 | Mailing Inbox           | C82, C40, C44, C42                                    |
| P30 | View Email              | C83, C82, C09                                         |
| P31 | Reply Email             | C83, C99, C81, C59                                    |
| P32 | To-do Page              | C48, C44, C65, C70, C45                               |
| P33 | Projects Page           | C22, C08, C40, C47                                    |
| P34 | My Projects             | C22, C07, C65, C27                                    |
| P35 | Project Summary         | C07, C84, C65, C78, C27                               |
| P36 | My Tasks                | C48, C78, C08, C40, C44                               |
| P37 | Project Files           | C31, C59, C47, C73                                    |

---

### Páginas Nivel 6 — Interactividad avanzada

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P38 | Kanban Board            | C94, C78, C79, C70, C73                               |
| P39 | Calendar Page           | C95, C84, C70, C08                                    |
| P40 | Chat Room Page          | C96, C80, C81, C09, C42                               |
| P41 | Datatables Page         | C48, C50, C47, C49, C62, C58                          |
| P42 | AI Prompts              | C97, C98, C46, C41                                    |
| P43 | Text Editor             | C99, C62, C59, C60                                    |
| P44 | Checkout                | C91, C92, C93, C65, C45                               |
| P45 | Order Confirmation      | C08, C30, C65                                         |
| P46 | Order Tracking          | C65, C08, C27                                         |
| P47 | Account Overview        | C09, C07, C41, C08, C30                               |
| P48 | Create Video Meeting    | C107, C101, C44, C45                                  |
| P49 | Join Video Meeting      | C107, C101, C09                                       |

---

### Páginas Nivel 7 — Dashboards y videollamada

| #   | Página                  | Componentes clave                                      |
|-----|-------------------------|--------------------------------------------------------|
| P50 | Dashboard base          | C102, C103, C104, C07, C48, C27                       |
| P51 | SaaS Dashboard          | C102, C07, C41, C48, C90, C27                         |
| P52 | E-commerce Dashboard    | C102, C07, C86, C48, C90, C91                         |
| P53 | Marketing Dashboard     | C102, C07, C27, C48, C40                              |
| P54 | Car Service Dashboard   | C102, C07, C65, C84, C08                              |
| P55 | Logistics Dashboard     | C102, C07, C27, C65, C08, C84                         |
| P56 | Bank Dashboard          | C102, C07, C30, C48, C65, C08                         |
| P57 | Crypto Dashboard        | C102, C07, C48, C08, C41                              |
| P58 | Music Dashboard         | C102, C100, C07, C41, C44                             |
| P59 | Projects Dashboard      | C102, C07, C94, C65, C27, C84                         |
| P60 | Customer Service Dash.  | C102, C07, C96, C82, C48, C08                         |
| P61 | Video Call Page         | C101, C85, C100, C42, C44                             |
| P62 | Rate Conversation       | C19, C45, C65                                         |
| P63 | Outgoing Call           | C85, C100, C09                                        |
| P64 | Incoming Call           | C85, C100, C09                                        |
| P65 | In Call                 | C101, C85, C100, C42, C44                             |
| P66 | Call Ended              | C08, C19, C45                                         |

---

## PARTE 3 — PLAN DE COMMITS

```bash
# Setup
feat: init              — Node, Tailwind v4, Alpine 3, estructura, tokens CSS

# Componentes
feat: components-n1     — C01–C11: estáticos base
feat: components-n2     — C12–C31: layout estructural
feat: components-n3     — C32–C46: alpine básico
feat: components-n4     — C47–C65: estado reactivo
feat: components-n5     — C66–C85: CRUD y sub-componentes complejos
feat: components-n6     — C86–C101: interactividad avanzada
feat: components-n7     — C102–C107: shells y page headers

# Páginas
feat: pages-n2          — P01–P07: error pages + auth estático
feat: pages-n3          — P08–P12: auth interactivo, notifications, pricing
feat: pages-n4          — P13–P24: app pages: users, products, billing, tickets
feat: pages-n5          — P25–P37: invoice, email, mailing, to-do, projects
feat: pages-n6          — P38–P49: kanban, calendar, chat, AI, editor, ecommerce
feat: pages-n7          — P50–P66: dashboards + videollamada completa
```

---

## Resumen

| Sección                   | Total |
|---------------------------|-------|
| Componentes               | 107   |
| Páginas                   | 66    |
| Niveles                   | 7     |
| Commits                   | 14    |
| Componentes nuevos        | 57    |
| Componentes plan original | 50    |

---

*Fuente de verdad de planificación para LayoutOS.*
*Actualizar antes de abrir un PR cuando se agreguen componentes o páginas.*
