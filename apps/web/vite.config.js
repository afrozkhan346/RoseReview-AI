import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        signup: './signup.html',
        dashboard: './dashboard.html',
        'pr-analysis': './pr-analysis.html',
        analytics: './analytics.html',
        settings: './settings.html',
        'design-system': './design-system.html'
      }
    }
  }
})
