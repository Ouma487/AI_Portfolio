import type { Config } from 'tailwindcss';

/**
 * Design tokens live as CSS variables in src/app/globals.css; this file only
 * maps them to Tailwind class names. See docs/notes/frontend.md for the
 * reasoning behind the scale and the palette.
 */
export default {
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial', 'sans-serif'],
        serif: ['var(--font-text)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // Fluid modular scale: ratio 1.2 at 360px, 1.333 at 1440px.
      fontSize: {
        'step--2': ['0.75rem', { lineHeight: '1.4' }],
        'step--1': ['0.8125rem', { lineHeight: '1.45' }],
        'step-0': ['var(--step-0)', { lineHeight: '1.6' }],
        'step-1': ['var(--step-1)', { lineHeight: '1.45' }],
        'step-2': ['var(--step-2)', { lineHeight: '1.2' }],
        'step-3': ['var(--step-3)', { lineHeight: '1.1' }],
        'step-4': ['var(--step-4)', { lineHeight: '1' }],
        'step-5': ['var(--step-5)', { lineHeight: '0.95' }],
        display: ['var(--step-display)', { lineHeight: '0.86' }],
      },
      maxWidth: {
        frame: '90rem',
        measure: '38rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        margin: 'var(--margin)',
        section: 'var(--space-section)',
        header: 'var(--header-h)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.2, 0.7, 0.1, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
