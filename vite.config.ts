import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'three',
      'clsx',
      'tailwind-merge',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ]
  },
  server: {
    host: true,
    port: 5173,
    open: false,
    watch: {
      ignored: ['**/android/**', '**/dist/**', '**/.gradle/**', '**/scripts/**']
    },
    proxy: {
      '/v1': {
        target: 'https://143-47-35-167.sslip.io',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
