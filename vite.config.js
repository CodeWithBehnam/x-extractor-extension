import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        try {
          mkdirSync('dist', { recursive: true });
          copyFileSync('manifest.json', 'dist/manifest.json');
          console.log('Manifest copied to dist/');
        } catch (err) {
          console.error('Error copying manifest:', err);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        'content-script': resolve(__dirname, 'src/content/content-script.js'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content-script') {
            return 'src/content/[name].js';
          }
          if (chunkInfo.name === 'service-worker') {
            return 'src/background/[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return 'src/popup/index.html';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    minify: false,
    sourcemap: false
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    globals: true,
    exclude: ['**/node_modules/**', '**/.bun/**']
  }
});
