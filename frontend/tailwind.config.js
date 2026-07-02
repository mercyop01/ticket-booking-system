/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0F',
        surface: '#16161A',
        'surface-elevated': '#1E1E24',
        primary: '#FF3366',
        secondary: '#FFB300',
        success: '#00E676',
        textPrimary: '#F5F5F7',
        textMuted: '#8E8E9A',
        border: '#2A2A35'
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
