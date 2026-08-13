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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-engine': ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/v1': {
        target: 'https://143-47-35-167.sslip.io',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
