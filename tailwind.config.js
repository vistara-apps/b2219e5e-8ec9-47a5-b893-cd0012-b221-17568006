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
            bg: 'hsl(210 30% 95%)',
            accent: 'hsl(170 70% 50%)',
            primary: 'hsl(210 40% 35%)',
            surface: 'hsl(210 30% 100%)',
          },
          borderRadius: {
            lg: '16px',
            md: '10px',
            sm: '6px',
          },
          boxShadow: {
            card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
          },
          spacing: {
            lg: '20px',
            md: '12px',
            sm: '8px',
          },
          fontSize: {
            body: ['1rem', { lineHeight: '1.5' }],
            display: ['1.875rem', { fontWeight: 'bold' }],
          },
          transitionDuration: {
            base: '200ms',
            fast: '100ms',
          },
          transitionTimingFunction: {
            'ease-in-out': 'ease-in-out',
          },
        },
      },
      plugins: [],
    }
  