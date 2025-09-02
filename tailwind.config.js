/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        surface: 'var(--surface)',
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
        'md': 'var(--radius-md)',
        'sm': 'var(--radius-sm)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
      },
      spacing: {
        'lg': 'var(--spacing-lg)',
        'md': 'var(--spacing-md)',
        'sm': 'var(--spacing-sm)',
      },
      backgroundColor: {
        'accent-50': 'hsl(170 70% 95%)',
      },
    },
  },
  plugins: [],
}

