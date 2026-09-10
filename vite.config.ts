import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Gemini key define block removed — Vite's built-in VITE_ prefix
      // handling already exposes VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
      // to the client safely (they're meant to be public), no extra
      // 'define' config needed for them.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
