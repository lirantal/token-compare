import { defineConfig } from 'vite'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  build: {
    outDir: 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          tokenizer: ['gpt-tokenizer'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['gpt-tokenizer'],
  },
})