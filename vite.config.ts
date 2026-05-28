import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ap_crossword/',
  server: {
    port: 3020,
  },
  define: {
    'process.env': {},
  },
});
