/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'luxury-black': 'hsl(var(--luxury-black))',
        'luxury-charcoal': 'hsl(var(--luxury-charcoal))',
        'luxury-slate': 'hsl(var(--luxury-slate))',
        'luxury-gray': 'hsl(var(--luxury-gray))',
        'gold-primary': 'hsl(var(--gold-primary))',
        'gold-accent': 'hsl(var(--gold-accent))',
        'gold-muted': 'hsl(var(--gold-muted))',
        'gold-subtle': 'hsl(var(--gold-subtle))',
        platinum: 'hsl(var(--platinum))',
        'platinum-pearl': 'hsl(var(--platinum-pearl))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        glass: '0 24px 54px rgba(10, 10, 15, 0.45)',
        luxury: '0 30px 80px rgba(4, 4, 6, 0.55)',
        gold: '0 18px 45px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #f5d37f 0%, #d4af37 100%)',
        'gradient-luxury': 'radial-gradient(circle at top, rgba(212, 175, 55, 0.18), transparent 60%)',
      },
      backdropBlur: {
        glass: '18px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.9s ease forwards',
        'slide-up': 'slideUp 0.8s ease forwards',
        'scale-in': 'scaleIn 0.8s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
        },
      },
    },
  },
  plugins: [],
}