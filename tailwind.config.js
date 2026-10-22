/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ns: {
          navy: '#142B4A',
          'navy-dark': '#0D1726',
          'navy-light': '#1E3C66',
          blue: '#2864A6',
          'blue-light': '#EBF3FA',
          amber: '#F4B942',
          'amber-light': '#FEF6E4',
          teal: '#1F9D8B',
          'teal-light': '#E8F7F5',
          red: '#C83E4D',
          'red-light': '#FDF2F3',
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          text: '#172334',
          muted: '#66758A',
          border: '#DCE3EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
