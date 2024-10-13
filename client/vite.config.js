import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'text-editor-indol-seven.vercel.app',
        secure: false,
      },
    },
  },

  plugins: [react()],
});