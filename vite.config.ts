
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { redact } from '@tanstack/redact/vite'
import path from 'path'

// Escape hatch: run on real React instead of @tanstack/redact
// (e.g. DISABLE_REDACT=true bun run dev)
const shouldUseRedact = process.env.DISABLE_REDACT !== 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ...(shouldUseRedact ? [redact()] : []),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split node_modules into long-lived cacheable vendor chunks so route
    // chunks stay small and library updates don't invalidate everything.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // pdfjs-dist is already isolated behind a dynamic import
          // (lazy PdfViewer); keep it out of shared vendor chunks.
          if (id.includes('pdfjs-dist')) return
          if (
            id.includes('node_modules/@tanstack/redact/') ||
            id.includes('node_modules/@tanstack/react-query/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('@radix-ui') || id.includes('node_modules/radix-ui/')) {
            return 'vendor-radix'
          }
          if (id.includes('node_modules/gsap/')) return 'vendor-gsap'
          if (
            id.includes('node_modules/effect/') ||
            id.includes('node_modules/@effect/')
          ) {
            return 'vendor-effect'
          }
          if (
            id.includes('node_modules/react-hook-form/') ||
            id.includes('node_modules/@hookform/') ||
            id.includes('node_modules/zod/')
          ) {
            return 'vendor-forms'
          }
          if (id.includes('blobatar')) return 'vendor-blobatar'
          if (id.includes('node_modules/lucide-react/')) return 'vendor-icons'
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://me.ajikkk.my.id',
        changeOrigin: true,
      },
    },
  },
})
