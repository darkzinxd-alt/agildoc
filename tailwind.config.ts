import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1A2B4C',
        },
        action: {
          mint: '#00D289',
        },
        bg: {
          ice: '#F4F7FB',
        },
        surface: {
          white: '#FFFFFF',
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(26,43,76,0.08)',
        'float': '0 20px 40px -20px rgba(0,210,137,0.25)',
      }
    },
  },
  plugins: [],
}
export default config
