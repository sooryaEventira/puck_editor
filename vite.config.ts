import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Default Azure backend URL
  const defaultBackendUrl = 'https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net'
  const proxyTarget = env.VITE_PROXY_TARGET || defaultBackendUrl

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      headers: {
        'Content-Security-Policy': `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob: http: https:; media-src 'self' data: blob: http: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https: ws: wss:; frame-src 'self' data: blob: https://docs.google.com https://www.google.com 
        https://maps.google.com 
        https://www.youtube.com 
        https://www.youtube-nocookie.com 
        https://player.vimeo.com 
        https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net;`.replace(/\s+/g, ' ').trim()
      },
    
      proxy: {
        // Proxy API requests to the backend server to avoid CORS issues
        // Defaults to Azure backend, can be overridden with VITE_PROXY_TARGET env variable
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          // Only proxy if backend is actually running (optional)
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log(`Proxy error - make sure backend server is running on ${proxyTarget}:`, err.message)
            })
          }
        }
      }
    },
  build: {
    outDir: 'build', // Match Azure Static Web Apps expected output location
    // Increase chunk size warning limit to 1000kb (from default 500kb)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better code splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'puck-vendor': ['@measured/puck'],
          'icons-vendor': ['@untitled-ui/icons-react'],
          'survey-vendor': ['survey-core', 'survey-react-ui'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Optimize asset file names
          const name = assetInfo.name || ''
          if (name.indexOf('.png') > -1 || name.indexOf('.jpg') > -1 || name.indexOf('.jpeg') > -1) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (name.indexOf('.css') > -1) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@measured/puck']
  }
  }
})
