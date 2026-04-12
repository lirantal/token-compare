import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
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
