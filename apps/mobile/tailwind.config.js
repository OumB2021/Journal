/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Backgrounds — use as bg-bg-base, bg-bg-surface, etc.
        bg: {
          base:     "var(--color-bg-base)",
          elevated: "var(--color-bg-elevated)",
          overlay:  "var(--color-bg-overlay)",
          surface:  "var(--color-bg-surface)",
        },
        // Borders — use as border-border, border-border-strong, border-border-subtle
        border: {
          DEFAULT: "var(--color-border-default)",
          strong:  "var(--color-border-strong)",
          subtle:  "var(--color-border-subtle)",
        },
        // Text — use as text-text-primary, text-text-secondary, etc.
        text: {
          primary:    "var(--color-text-primary)",
          secondary:  "var(--color-text-secondary)",
          tertiary:   "var(--color-text-tertiary)",
          "on-accent": "#FFFFFF",
        },
        // Icons — use as text-icon or text-icon-strong
        icon: {
          DEFAULT: "var(--color-icon-default)",
          strong:  "var(--color-icon-strong)",
        },
        // Interactive (buttons, tappable elements)
        interactive: {
          bg:   "var(--color-interactive-bg)",
          text: "var(--color-interactive-text)",
        },
        // Semantic accents
        accent: {
          DEFAULT: "#5B8DEF",
          subtle:  "var(--color-accent-primary-subtle)",
        },
        danger: {
          DEFAULT: "#E05A5A",
          strong:  "#FF5C33",
          subtle:  "var(--color-accent-danger-subtle)",
        },
        success: {
          DEFAULT: "#22C55E",
          subtle:  "var(--color-accent-success-subtle)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          subtle:  "var(--color-accent-warning-subtle)",
        },
      },

      spacing: {
        xs:   "4px",
        sm:   "8px",
        md:   "16px",
        lg:   "24px",
        xl:   "32px",
        "2xl": "48px",
        "3xl": "64px",
      },

      borderRadius: {
        none: "0px",
        s:    "var(--radius-s)",
        m:    "var(--radius-m)",
        l:    "var(--radius-l)",
        full: "999px",
      },

      fontFamily: {
        // Usage: font-sans, font-sans-medium, font-sans-semibold, font-sans-bold
        sans:          ["Inter_400Regular", "Inter", "sans-serif"],
        "sans-medium":   ["Inter_500Medium",  "Inter", "sans-serif"],
        "sans-semibold": ["Inter_600SemiBold", "Inter", "sans-serif"],
        "sans-bold":     ["Inter_700Bold",     "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
