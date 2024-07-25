/** @type {import('tailwindcss').Config} */

import * as defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.jsx",
    "./resources/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"League Spartan"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('daisyui')
  ],
  daisyui: {
    themes: [],
    base: false
  }
}

