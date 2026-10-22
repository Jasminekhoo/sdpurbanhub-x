import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_GOOGLE_MAPS_API_KEY || '';

  return {
    plugins: [react()],
    base: './',
    server: {
      port: 3000,
      open: false
    },
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(apiKey)
    }
  };
})
