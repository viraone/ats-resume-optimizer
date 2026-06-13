/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jobscan: {
          blue: {
            DEFAULT: '#1c3d5a', // Deep slate blue
            hover: '#132c42',
            light: '#f0f4f8',
          },
          green: {
            DEFAULT: '#05a46c', // Jobscan style bright green
            hover: '#048e5d',
            bg: '#e6f6f1',
          },
          dark: '#1e293b', // Dark gray/slate for text
          gray: {
            light: '#f8fafc',
            border: '#e2e8f0',
            text: '#64748b'
          }
        }
      }
    },
  },
  plugins: [],
}
