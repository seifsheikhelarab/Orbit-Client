import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://orbit-server-gamma.vercel.app",
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 2000, // BuilderPage includes PDF generation libs
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Split heavy vendor libs for independent caching
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform') || id.includes('node_modules/zod')) {
            return 'vendor-forms';
          }
          if (id.includes('node_modules/@react-pdf') || id.includes('node_modules/pdfjs-dist') || id.includes('node_modules/@react-pdf-viewer')) {
            return 'vendor-pdf';
          }
        }
      }
    }
  }
})
