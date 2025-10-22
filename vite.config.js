import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite configuration for Vercel deployment
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
  },
  // ✅ Ensures React Router works in production (important for Vercel)
  base: '/',
})
