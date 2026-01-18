
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Mevcut ortam değişkenlerini yükle
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // API_KEY'i hem Netlify ortamından hem de .env dosyasından alabilecek şekilde tanımla
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || "")
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: true,
      // Build sırasında gizli bilgi tarayıcılarını tetikleyebilecek büyük chunk'ları yönet
      chunkSizeWarningLimit: 1000
    }
  };
});
