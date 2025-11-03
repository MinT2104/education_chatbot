/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Purple (Brand Color)
        primary: {
          50: '#F4EDFF',
          100: '#E6DBFF',
          200: '#CBB8FF',
          300: '#B194FF',
          400: '#966FFF',
          500: '#7C4DFF', // Brand color
          600: '#6736F5',
          700: '#5327D8',
          800: '#3F1DAA',
          900: '#2B157A',
        },
        // Secondary - Indigo/Blue
        secondary: {
          400: '#6B8CFF',
          500: '#4C6BFF',
          600: '#3853E6',
        },
        // Accent - Teal (for education theme)
        accent: {
          500: '#14B8A6',
          600: '#0EA5A3',
        },
        // Semantic colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        // Design tokens for chat UI
        bg: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--bg-surface)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7C4DFF 0%, #4C6BFF 50%, #14B8A6 100%)',
        'cta-gradient': 'linear-gradient(90deg, #966FFF 0%, #7C4DFF 100%)',
        'bubble-gradient': 'linear-gradient(180deg, #1B1C26 0%, #151621 100%)',
        'card-gradient': 'linear-gradient(160deg, #F4EDFF 0%, #E6DBFF 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'chat': '880px',
        'chat-lg': '900px',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'slide-in-from-left': 'slideInFromLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out-to-left': 'slideOutToLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-from-right': 'slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 77, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 77, 255, 0.5)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}


