/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderWidth: {
        DEFAULT: "1px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#F4EDFF",
          100: "#E6DBFF",
          200: "#CBB8FF",
          300: "#B194FF",
          400: "#966FFF",
          500: "#7C4DFF",
          600: "#6736F5",
          700: "#5327D8",
          800: "#3F1DAA",
          900: "#2B157A",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          400: "#6B8CFF",
          500: "#4C6BFF",
          600: "#3853E6",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          500: "#14B8A6",
          600: "#0EA5A3",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        bg: {
          DEFAULT: "var(--bg)",
          surface: "var(--bg-surface)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #7C4DFF 0%, #4C6BFF 50%, #14B8A6 100%)",
        "cta-gradient": "linear-gradient(90deg, #966FFF 0%, #7C4DFF 100%)",
        "bubble-gradient": "linear-gradient(180deg, #1B1C26 0%, #151621 100%)",
        "card-gradient": "linear-gradient(160deg, #F4EDFF 0%, #E6DBFF 100%)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        chat: "880px",
        "chat-lg": "900px",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        mono: ["Fira Code", "Consolas", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        slideInFromBottom: {
          "0%": {
            transform: "translateY(8px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideInFromLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        slideOutToLeft: {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
        },
        slideInFromRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        scaleIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        scaleOut: {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
        },
        bounceSubtle: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-4px)",
          },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(124, 77, 255, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(124, 77, 255, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "fade-out": "fadeOut 0.2s ease-in-out",
        "slide-in-from-bottom": "slideInFromBottom 0.3s ease-out",
        "slide-in-from-left":
          "slideInFromLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out-to-left": "slideOutToLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-from-right":
          "slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-out": "scaleOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-subtle": "bounceSubtle 0.5s ease-in-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};
