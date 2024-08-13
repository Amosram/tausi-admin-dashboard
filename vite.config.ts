import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      experimental: {
        enableCodeSplitting: true
      }
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  }
})
