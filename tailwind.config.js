export default {
  content: ["./src/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {

      // ── Colores ──────────────────────────────────────────────
      colors: {
        page:      "#FAFAFA",   // zinc-50
        surface:   "#F4F4F5",   // zinc-100
        muted:     "#A1A1AA",   // zinc-400
        secondary: "#52525B",   // zinc-600
        primary:   "#18181B",   // zinc-900
        dark:      "#09090B",   // zinc-950
        accent: {
          subtle:  "#EFF6FF",   // blue-50
          light:   "#DBEAFE",   // blue-100
          border:  "#BFDBFE",   // blue-200
          icon:    "#3B82F6",   // blue-500
          DEFAULT: "#2563EB",   // blue-600
          hover:   "#1D4ED8",   // blue-700
        },
      },

      // ── Fuentes ──────────────────────────────────────────────
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },

      // ── Sombras custom ───────────────────────────────────────
      boxShadow: {
        "xs": "0 1px 2px rgba(0,0,0,.06)",
        "sm": "0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)",
        "md": "0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.05)",
        "lg": "0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05)",
        "xl": "0 20px 25px rgba(0,0,0,.08), 0 8px 10px rgba(0,0,0,.05)",
      },

      // ── Transiciones ─────────────────────────────────────────
      transitionDuration: {
        "75":  "75ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "500": "500ms",
      },

      // ── Z-index ──────────────────────────────────────────────
      zIndex: {
        "dropdown":  "10",
        "modal":     "20",
        "toast":     "30",
        "sidebar":   "40",
        "overlay":   "50",
      },

    }
  },
  plugins: [],
}
