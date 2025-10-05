/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0f',
        surface: '#16161d',
        accent: '#d4af37',
        muted: '#f5f2e8',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['\'Poppins\'', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['\'Playfair Display\'', 'serif'],
      },
      boxShadow: {
        glow: '0 18px 45px -15px rgba(212, 175, 55, 0.45)',
        card: '0 18px 40px -24px rgba(0,0,0,0.75)',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(135deg, rgba(11,11,15,0.88), rgba(11,11,15,0.55))',
        'accent-gradient': 'linear-gradient(135deg, rgba(212,175,55,0.92), rgba(198,156,38,0.76))',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}

