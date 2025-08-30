import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/personal-landing-page/',
  plugins: [react()],
  preview: {
    port: 28550,
    strictPort: true
  }
})
