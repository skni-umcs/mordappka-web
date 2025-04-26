import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
    // '/api': 'http://localhost:5000',
    '/api': 'http://10.50.50.77:8081',
    }
  }
})
