import type { Config } from 'tailwindcss';

/**
 * Design tokens live as CSS variables in src/app/globals.css; this file only
 * maps them to Tailwind class names. See docs/notes/frontend.md for the
 * reasoning behind the scale and the palette.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        'paper-deep': token('paper-deep'),
        mat: token('mat'),
        ink: token('ink'),
        graphite: token('graphite'),
        accent: token('accent'),
        pencil: token('pencil'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        serif: ['var(--font-text)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      // Fluid modular scale: ratio 1.2 at 360px, 1.25 at 1440px.
      fontSize: {
        'step--2': ['0.75rem', { lineHeight: '1.45' }],
        'step--1': ['0.8125rem', { lineHeight: '1.5' }],
        'step-0': ['var(--step-0)', { lineHeight: '1.65' }],
        'step-1': ['var(--step-1)', { lineHeight: '1.45' }],
        'step-2': ['var(--step-2)', { lineHeight: '1.3' }],
        'step-3': ['var(--step-3)', { lineHeight: '1.15' }],
        'step-4': ['var(--step-4)', { lineHeight: '1.08' }],
        'step-5': ['var(--step-5)', { lineHeight: '1.02' }],
        display: ['var(--step-display)', { lineHeight: '0.95' }],
      },
      maxWidth: {
        frame: '90rem',
        measure: '36rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        margin: 'var(--margin)',
        section: 'var(--space-section)',
        header: 'var(--header-h)',
      },
    },
  },
  plugins: [],
} satisfies Config;
