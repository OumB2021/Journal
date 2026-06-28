const { staticColors, lightColors, darkColors, spacing, radii } = require('./theme/tokens');

/** camelCase key → CSS custom property name, e.g. bgBase → --color-bg-base */
function toCssVar(key) {
  return '--color-' + key.replace(/([A-Z])/g, c => '-' + c.toLowerCase());
}

/** Build a { '--color-foo': '#hex' } object for addBase */
function cssVars(colorMap) {
  return Object.fromEntries(Object.entries(colorMap).map(([k, v]) => [toCssVar(k), v]));
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Backgrounds — use as bg-bg-base, bg-bg-surface, etc.
        bg: {
          base:     'var(--color-bg-base)',
          elevated: 'var(--color-bg-elevated)',
          overlay:  'var(--color-bg-overlay)',
          surface:  'var(--color-bg-surface)',
        },
        // Borders — use as border-border, border-border-strong, border-border-subtle
        border: {
          DEFAULT: 'var(--color-border-default)',
          strong:  'var(--color-border-strong)',
          subtle:  'var(--color-border-subtle)',
        },
        // Text — use as text-text-primary, text-text-secondary, etc.
        text: {
          primary:     'var(--color-text-primary)',
          secondary:   'var(--color-text-secondary)',
          tertiary:    'var(--color-text-tertiary)',
          'on-accent': staticColors.textOnAccent,
        },
        // Icons — use as text-icon or text-icon-strong
        icon: {
          DEFAULT: 'var(--color-icon-default)',
          strong:  'var(--color-icon-strong)',
        },
        // Interactive (buttons, tappable elements)
        interactive: {
          bg:   'var(--color-interactive-bg)',
          text: 'var(--color-interactive-text)',
        },
        // Semantic accents — static values come directly from tokens
        accent: {
          DEFAULT: staticColors.accentPrimary,
          subtle:  'var(--color-accent-primary-subtle)',
        },
        danger: {
          DEFAULT: staticColors.accentDanger,
          strong:  staticColors.accentDangerStrong,
          subtle:  'var(--color-accent-danger-subtle)',
        },
        success: {
          DEFAULT: staticColors.accentSuccess,
          subtle:  'var(--color-accent-success-subtle)',
        },
        warning: {
          DEFAULT: staticColors.accentWarning,
          subtle:  'var(--color-accent-warning-subtle)',
        },
      },

      // Derive px values from the numeric spacing tokens
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([k, v]) => [k, `${v}px`])
      ),

      borderRadius: {
        none: `${radii.none}px`,
        s:    'var(--radius-s)',
        m:    'var(--radius-m)',
        l:    'var(--radius-l)',
        full: `${radii.full}px`,
      },

      fontFamily: {
        sans:          ['Inter_400Regular', 'Inter', 'sans-serif'],
        'sans-medium':   ['Inter_500Medium',  'Inter', 'sans-serif'],
        'sans-semibold': ['Inter_600SemiBold', 'Inter', 'sans-serif'],
        'sans-bold':     ['Inter_700Bold',     'Inter', 'sans-serif'],
      },
    },
  },

  plugins: [
    function ({ addBase }) {
      addBase({
        // Light-mode defaults
        ':root': {
          ...cssVars(lightColors),
          '--radius-s': `${radii.light.s}px`,
          '--radius-m': `${radii.light.m}px`,
          '--radius-l': `${radii.light.l}px`,
        },
        // Dark-mode overrides
        '@media (prefers-color-scheme: dark)': {
          ':root': {
            ...cssVars(darkColors),
            '--radius-s': `${radii.dark.s}px`,
            '--radius-m': `${radii.dark.m}px`,
            '--radius-l': `${radii.dark.l}px`,
          },
        },
      });
    },
  ],
};
