/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0C0612',
        surface: '#1A0D28',
        primary: '#7B61FF',
        danger: '#FF2D6B',
        warning: '#E8C547',
        foreground: '#EDE9F8',
        muted: '#9B8FBF',
        bg: '#0C0612',
        fg: '#EDE9F8',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
