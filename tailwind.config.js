/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-orange': '#E85D2B',
        'alley-green': '#1B4332',
        'wall-cream': '#F4E4C1',
        'neon-pink': '#FF6B9D',
        'electric-teal': '#4ECDC4',
        'earth-brown': '#8B5A2B',
        'ink-black': '#1A1A1A',
      },
      fontFamily: {
        'display': ['"ZCOOL KuaiLe"', 'cursive'],
        'body': ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wobble': 'wobble 0.5s ease-in-out',
        'scan': 'scan 2s linear infinite',
        'tape-in': 'tapeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'stamp': 'stamp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'typewriter': 'typewriter 2s steps(40) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        tapeIn: {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
        },
        stamp: {
          '0%': { transform: 'scale(2)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
