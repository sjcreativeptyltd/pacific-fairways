/** @type {import('tailwindcss').Config} */

// Token bridge to the active style preset. The values themselves live in
// src/lib/styles.ts and are emitted as CSS custom properties by
// BaseLayout.astro, so Tailwind never needs to know which style is active —
// changing ACTIVE_STYLE restyles every utility below with it.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        'bg-alt': 'var(--color-bg-alt)',
        text: 'var(--color-text)',
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
      },
    },
  },
  plugins: [],
};
