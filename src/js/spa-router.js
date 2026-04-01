// src/js/spa-router.js
// Motor SPA para LayoutOS — carga HTML dinámicamente en <main>

(function () {
  const main = document.getElementById('spa-content');
  const welcomeScreen = document.getElementById('welcome-screen');
  const navLinks = document.querySelectorAll('#spa-sidebar a[href]');
  let currentPath = null;
  const loadedCdns = new Set();

  // ── Cargar CDNs externos dinámicamente ───────────────────
  function loadCdns(cdns) {
    if (!cdns || !cdns.length) return Promise.resolve();
    const promises = cdns.map(url => {
      if (loadedCdns.has(url)) return Promise.resolve();
      loadedCdns.add(url);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = () => {
          loadedCdns.delete(url);
          reject(new Error(`Failed to load: ${url}`));
        };
        document.head.appendChild(script);
      });
    });
    return Promise.all(promises);
  }

  // ── Parsear HTML remoto ──────────────────────────────────
  function parseBody(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Extraer scripts inline (no el CDN de Alpine)
    const scripts = [];
    doc.querySelectorAll('script').forEach(s => {
      if (!s.src && s.textContent.trim()) {
        scripts.push(s.textContent);
      }
    });
    // Extraer styles inline (excepto [x-cloak])
    const styles = [];
    doc.querySelectorAll('style').forEach(s => {
      if (!s.textContent.includes('x-cloak')) {
        styles.push(s.textContent);
      }
    });
    // Extraer CDNs externos (excepto Alpine)
    const cdns = [];
    doc.querySelectorAll('script[src]').forEach(s => {
      if (!s.src.includes('alpinejs')) {
        cdns.push(s.getAttribute('src'));
      }
    });
    // Extraer contenido del body (sin scripts, sin styles)
    const body = doc.body;
    body.querySelectorAll('script').forEach(s => s.remove());
    body.querySelectorAll('style').forEach(s => s.remove());
    return { html: body.innerHTML, scripts, styles, cdns };
  }

  // ── Limpiar Alpine del main ──────────────────────────────
  function cleanupAlpine() {
    if (main._x_dataStack) {
      delete main._x_dataStack;
    }
    // Destruir árboles Alpine dentro del main
    main.querySelectorAll('[x-data]').forEach(el => {
      if (el._x_dataStack) {
        Alpine.destroyTree(el);
      }
    });
    // Limpiar funciones globales registradas por componentes previos
    // (las funciones nombradas se sobreescriben naturalmente)
  }

  // ── Cargar una ruta ──────────────────────────────────────
  async function loadRoute(path) {
    if (path === currentPath) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseBody(text);

      // Limpiar Alpine
      cleanupAlpine();

      // Ocultar welcome, mostrar contenido
      if (welcomeScreen) welcomeScreen.style.display = 'none';
      main.innerHTML = '';

      // Inyectar estilos custom
      if (parsed.styles.length) {
        const styleEl = document.createElement('style');
        styleEl.textContent = parsed.styles.join('\n');
        main.appendChild(styleEl);
      }

      // Inyectar HTML
      const container = document.createElement('div');
      container.className = 'h-full';
      container.innerHTML = parsed.html;
      main.appendChild(container);

      // Cargar CDNs externos antes de ejecutar scripts inline
      await loadCdns(parsed.cdns);

      // Ejecutar scripts (funciones nombradas de Alpine)
      parsed.scripts.forEach(code => {
        try {
          const script = document.createElement('script');
          script.textContent = code;
          document.body.appendChild(script);
          document.body.removeChild(script);
        } catch (e) {
          console.warn('Error ejecutando script:', e);
        }
      });

      // Inicializar Alpine en el nuevo contenido
      Alpine.initTree(container);

      // Inyectar botones de descarga si es componente N1-N6
      if (typeof injectDownloadButtons === 'function') {
        injectDownloadButtons(main, path, text, parsed.scripts, parsed.styles, parsed.cdns);
      }

      // Actualizar estado
      currentPath = path;
      updateActiveLink(path);
      main.scrollTop = 0;

      // Actualizar título
      const h1 = container.querySelector('h1');
      if (h1) {
        document.title = `LayoutOS · ${h1.textContent}`;
      }

    } catch (err) {
      main.innerHTML = `
        <div class="h-full flex items-center justify-center text-center px-6">
          <div class="space-y-3">
            <p class="text-sm text-rose-600 font-medium">Error al cargar</p>
            <p class="text-xs text-zinc-400">${path}</p>
            <a href="${path}" target="_blank" class="btn-secondary text-xs inline-block">Abrir en nueva pestaña</a>
          </div>
        </div>`;
    }
  }

  // ── Active state del sidebar ─────────────────────────────
  function updateActiveLink(path) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === path;
      link.classList.toggle('bg-blue-50', isActive);
      link.classList.toggle('text-blue-600', isActive);
      link.classList.toggle('font-medium', isActive);
      link.classList.toggle('text-zinc-600', !isActive);
    });
  }

  // ── Interceptar clicks del sidebar ───────────────────────
  document.getElementById('spa-sidebar').addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    e.preventDefault();
    const path = link.getAttribute('href');
    window.location.hash = path;
  });

  // ── Hash routing ─────────────────────────────────────────
  function onHashChange() {
    const hash = window.location.hash.slice(1); // quitar #
    if (hash) {
      loadRoute(hash);
      // Scroll sidebar al link activo
      const activeLink = document.querySelector(`#spa-sidebar a[href="${hash}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('hashchange', onHashChange);

  // Cargar ruta inicial si hay hash
  if (window.location.hash) {
    onHashChange();
  }
})();
