import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/Field-Ops/' : '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 4173,
  },
  define: {
    'process.env': {}
  }
});