import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/randomizer-game/',
  server: {
    port: 3020,
  },
  define: {
    'process.env': {},
  },
});
