import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base '/GALPEX/' permite servir la app desde GitHub Pages (repo project page).
// En desarrollo (npm run dev) se usa '/' para que localhost funcione normal.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/GALPEX/' : '/',
  plugins: [react()],
}))
