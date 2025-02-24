import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode']
  },
  server: {
    fs: {
      allow: [
      '/Users/Nzogue/Documents/dibiye/frontend',
      ],
    }
  },
  
});
