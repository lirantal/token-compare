import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  build: {
    outDir: 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main:                resolve(__dirname, 'index.html'),
        blog:                resolve(__dirname, 'blog/index.html'),
        'blog-tokenization': resolve(__dirname, 'blog/what-is-llm-tokenization/index.html'),
        'blog-count-tokens': resolve(__dirname, 'blog/how-to-count-tokens-gpt4/index.html'),
        'blog-reduce':       resolve(__dirname, 'blog/reduce-token-count-prompts/index.html'),
      },
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