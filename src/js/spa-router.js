// src/js/spa-router.js
// Motor SPA para LayoutOS — carga HTML dinámicamente en <main>

(function () {
  const main = document.getElementById('spa-content');
  let currentPath = null;
  const loadedCdns = new Set();
  const routeCache = new Map();
  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

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
    // Extraer scripts inline y CDNs externos
    const scripts = [];
    const cdns = [];
    doc.querySelectorAll('script').forEach(s => {
      const src = s.getAttribute('src');
      if (src) {
        // Script externo — guardar CDN (excepto Alpine y scripts locales)
        if (!src.includes('alpinejs') && !src.startsWith('/src/')) {
          cdns.push(src);
        }
      } else if (s.textContent.trim()) {
        // Script inline
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
      // Limpiar Alpine
      cleanupAlpine();

      // Skeleton de carga
      main.innerHTML = `
        <div class="px-6 py-12 max-w-5xl mx-auto space-y-6 animate-pulse">
          <div class="h-8 w-64 bg-zinc-200 rounded-lg"></div>
          <div class="h-4 w-96 bg-zinc-100 rounded"></div>
          <div class="h-64 bg-zinc-100 rounded-xl"></div>
        </div>`;

      let text;
      if (!isDev && routeCache.has(path)) {
        text = routeCache.get(path);
      } else {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        text = await res.text();
        if (!isDev) routeCache.set(path, text);
      }
      const parsed = parseBody(text);

      // Inyectar estilos custom
      if (parsed.styles.length) {
        const styleEl = document.createElement('style');
        styleEl.textContent = parsed.styles.join('\n');
        main.appendChild(styleEl);
      }

      // Cargar CDNs externos ANTES de insertar HTML en el DOM
      await loadCdns(parsed.cdns);

      // Ejecutar scripts (definir funciones Alpine) ANTES de insertar HTML
      let scriptError = false;
      parsed.scripts.forEach(code => {
        try {
          const script = document.createElement('script');
          script.textContent = code;
          document.body.appendChild(script);
          document.body.removeChild(script);
        } catch (e) {
          console.warn('Error ejecutando script:', e);
          scriptError = true;
        }
      });

      // Insertar HTML pausando MutationObserver de Alpine
      const container = document.createElement('div');
      container.className = 'h-full';
      container.innerHTML = parsed.html;
      Alpine.mutateDom(() => {
        main.appendChild(container);
      });

      // Inicializar Alpine manualmente (sin doble-init del MutationObserver)
      Alpine.initTree(container);

      // Mostrar advertencia si algún script falló
      if (scriptError) {
        const banner = document.createElement('div');
        banner.className = 'bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg mb-4 mx-6 mt-4';
        banner.textContent = 'Un script de este componente falló al ejecutarse. Revisa la consola para más detalles.';
        container.prepend(banner);
      }

      // Inyectar botones de descarga si es componente N1-N6
      if (typeof injectDownloadButtons === 'function') {
        injectDownloadButtons(main, path, text, parsed.scripts, parsed.styles, parsed.cdns);
      }

      // Actualizar estado
      currentPath = path;
      window.dispatchEvent(new CustomEvent('route-changed', { detail: { path } }));
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

  // ── Interceptar clicks del sidebar ───────────────────────
  document.getElementById('spa-sidebar').addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    e.preventDefault();
    const path = link.getAttribute('href');
    window.location.hash = path;
  });

  // ── Prefetch en hover ──────────────────────────────────────
  document.getElementById('spa-sidebar').addEventListener('mouseenter', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const path = link.getAttribute('href');
    if (!path || routeCache.has(path)) return;
    fetch(path).then(r => r.ok ? r.text() : null).then(t => {
      if (t && !isDev) routeCache.set(path, t);
    });
  }, true);

  // ── Hash routing ─────────────────────────────────────────
  function onHashChange() {
    const hash = window.location.hash.slice(1); // quitar #
    if (hash && hash !== '/index.html' && hash !== 'index.html') {
      loadRoute(hash);
      // Scroll sidebar al link activo
      const activeLink = document.querySelector(`#spa-sidebar a[href="${hash}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    } else {
      loadRoute('/src/pages/welcome.html');
    }
  }

  window.addEventListener('hashchange', onHashChange);

  // Cargar ruta inicial
  onHashChange();
})();
