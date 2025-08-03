import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png']
    })
  ],
  server: {
    port: 6080
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true
  },
})