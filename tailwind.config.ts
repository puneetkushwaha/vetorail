import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fintech Slate Canvas Foundation (Linear / Stripe / Mercury style)
        canvas: {
          DEFAULT: '#F8FAFC', // slate-50 neutral workspace canvas
          subtle: '#F1F5F9',  // slate-100 headers, inactive tabs, chip backgrounds
          muted: '#E2E8F0',
        },
        surface: {
          DEFAULT: '#FFFFFF', // pure white card surface
          elevated: '#FFFFFF',
          hover: '#F8FAFC',
          card: '#FFFFFF',
        },
        border: {
          subtle: '#F1F5F9',
          DEFAULT: '#E2E8F0', // slate-200 card borders and row dividers
          active: '#CBD5E1',  // slate-300 interactive focus borders
          strong: '#94A3B8',  // slate-400
        },
        // Brand Indigo / Violet Palette
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary action button & active highlights
          700: '#4338CA', // Primary button hover
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        // Statutory Luminous Compliance Status Colors
        pass: {
          bg: '#ECFDF5',      // emerald-50
          border: '#A7F3D0',  // emerald-200
          text: '#065F46',    // emerald-800
          glow: '#10B981',    // emerald-500
        },
        hold: {
          bg: '#FFFBEB',      // amber-50
          border: '#FDE68A',  // amber-200
          text: '#92400E',    // amber-800
          glow: '#F59E0B',    // amber-500
        },
        veto: {
          bg: '#FEF2F2',      // rose-50
          border: '#FECACA',  // rose-200
          text: '#991B1B',    // rose-800
          glow: '#EF4444',    // rose-500
        },
        msme: {
          bg: '#FFF7ED',      // orange-50
          border: '#FED7AA',  // orange-200
          text: '#9A3412',    // orange-800
          glow: '#F97316',    // orange-500
        },
        info: {
          bg: '#F0F9FF',      // sky-50
          border: '#BAE6FD',  // sky-200
          text: '#0369A1',    // sky-800
          glow: '#0EA5E9',    // sky-500
        },
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        drawer: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        premium: '0 20px 40px -15px rgba(79, 70, 229, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'glow-pass': '0 0 14px -2px rgba(16, 185, 129, 0.40)',
        'glow-hold': '0 0 14px -2px rgba(245, 158, 11, 0.40)',
        'glow-veto': '0 0 14px -2px rgba(239, 68, 68, 0.45)',
        'glow-msme': '0 0 16px -2px rgba(249, 115, 22, 0.45)',
        'glow-brand': '0 0 20px -3px rgba(99, 102, 241, 0.35)',
      },
      borderRadius: {
        '2xs': '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-msme': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
        'beam': 'beam 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(249, 115, 22, 0.3)' },
          '50%': { boxShadow: '0 0 18px rgba(249, 115, 22, 0.65)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        beam: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
