/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palet: Industrial Dark + Electric Cyan accent
        primary: {
          50:  '#e6fffe',
          100: '#ccfffd',
          200: '#99fffa',
          300: '#66fff7',
          400: '#33fff4',
          500: '#00f0e6',   // main accent
          600: '#00c0b8',
          700: '#009088',
          800: '#006058',
          900: '#003028',
        },
        dark: {
          900: '#030712',   // bg utama
          800: '#0d1117',   // card bg
          700: '#161b22',   // border/subtle
          600: '#21262d',   // hover state
          500: '#30363d',   // divider
          400: '#484f58',   // muted text
          300: '#6e7681',   // placeholder
          200: '#8b949e',   // secondary text
          100: '#c9d1d9',   // body text
          50:  '#e6edf3',   // heading
        },
      },
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        heading: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'cursor-blink': 'blink 1s step-end infinite',
        'scan': 'scan 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00f0e6, 0 0 10px #00f0e6' },
          '100%': { boxShadow: '0 0 20px #00f0e6, 0 0 40px #00f0e6, 0 0 80px #00f0e6' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0, 240, 230, 0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 240, 230, 0.05) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0, 240, 230, 0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, #030712 0%, #0d1117 40%, #030712 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
