import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/v2": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api\/v2/, ""),
        },
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
    },
  };
});
