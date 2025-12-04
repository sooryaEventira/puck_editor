import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob: http: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https: ws: wss:; frame-src 'self' data: blob: https://docs.google.com;"
    },
    proxy: {
      // Proxy API requests to the backend server to avoid CORS issues
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Only proxy if backend is actually running (optional)
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error - make sure backend server is running on http://localhost:8000:', err.message)
          })
        }
      }
    }
  }
})
