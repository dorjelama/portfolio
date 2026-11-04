import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  // PGlite loads its own .wasm/.data files; Vite's dep pre-bundling breaks those paths.
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
})
