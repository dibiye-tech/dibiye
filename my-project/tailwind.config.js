/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        primary:'#096197',
        secondary:'#DE290C',
        tertiary: '#63ADDA',
        fourth: '#D9D9D9'
        
      },
      container:{
        center:true,
        padding:{
          DEFAULT:'1rem',
          sm: '3rem',
        },
      },
    },
  },
  plugins: [],
}

