import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  server: {
    // Configure MIME types for font files
    mimeTypes: {
      // Add or modify the MIME type for TTF files
      'font/ttf': ['ttf'],
    },
  },
})
