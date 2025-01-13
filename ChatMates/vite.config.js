import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(fileURLToPath(import.meta.url), './src/components'),
      '@pages': path.resolve(fileURLToPath(import.meta.url), './src/pages'),
    },
  },
});
