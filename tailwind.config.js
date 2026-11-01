/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soiree: {
          bg: '#F5EDE0',         // Beige background
          cream: '#FAF5EC',      // Cream cards
          sand: '#E3D5BF',       // Sand borders
          sandLight: '#EDE3D1',
          burgundy: '#6D1A2B',   // Burgundy primary
          burgundyDeep: '#4A0F1C', // Deep Burgundy (headers, hover)
          rose: '#9B3347',       // Rose-Burgundy tint (accents)
          ink: '#2B1B1B',        // Ink text
          muted: '#7A6A5E',      // Muted text
          gold: '#B8935A',       // Antique gold (sparingly)
          goldLight: '#E8D8B8',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(74, 15, 28, 0.08), 0 4px 12px -2px rgba(43, 27, 27, 0.04)',
        'luxury-lg': '0 20px 40px -10px rgba(74, 15, 28, 0.12), 0 8px 20px -4px rgba(43, 27, 27, 0.06)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(109, 26, 43, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
