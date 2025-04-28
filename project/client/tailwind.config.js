/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6ECFF',
          100: '#CCDAFF',
          200: '#99B5FF',
          300: '#668FFF',
          400: '#336AFF',
          500: '#3366FF', // primary
          600: '#0041F5',
          700: '#0033C2',
          800: '#00268F',
          900: '#001A5C',
        },
        secondary: {
          50: '#E0F7F6',
          100: '#B3EAE6',
          200: '#80DCD5',
          300: '#4DCEC3',
          400: '#26C4B7',
          500: '#00B8A9', // secondary
          600: '#009E92',
          700: '#008378',
          800: '#00695F',
          900: '#004F47',
        },
        accent: {
          50: '#EEEAF3',
          100: '#D4CAE0',
          200: '#B9A7CD',
          300: '#9F84BA',
          400: '#856AA8',
          500: '#6B5B95', // accent
          600: '#574A7A',
          700: '#433A5F',
          800: '#2F2944',
          900: '#1C192A',
        },
        success: {
          500: '#22C55E',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Segoe UI',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-once': 'pulse 1.5s ease-in-out 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}