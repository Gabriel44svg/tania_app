/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amor: {
          rojo: '#e63946',       /* Rojo vibrante y pasional */
          rosa: '#ffb5a7',       /* Rosa suave y dulce */
          rosafuerte: '#f08080', /* Rosa con un toque de coral */
          blanco: '#ffffff',     /* Blanco puro */
          grisclaro: '#f8f9fa',  /* Fondo muy sutil */
          gristexto: '#6c757d',  /* Gris elegante para textos secundarios */
        }
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'], // Ideal para frases lindas
      }
    },
  },
  plugins: [],
}