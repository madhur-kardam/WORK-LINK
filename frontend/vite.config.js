import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend calls the API at '/api' (same as before) -> proxied to the Express backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  }
});
