/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

import seoPlugin from './vite-plugins/seo.js';

export default defineConfig({
  plugins: [react(), seoPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    // Один воркер-поток на несколько файлов: jsdom не создаётся заново для каждого файла
    pool: 'vmThreads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
