import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/dev/', 
  build: {
    rollupOptions: {
      output: {
        // Aceasta este linia magică ce previne eroarea "Cannot access 'm' before initialization"
        manualChunks: undefined 
      }
    }
  }
});
