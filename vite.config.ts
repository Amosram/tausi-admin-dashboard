import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const ReactCompilerConfig = {
  target: '18'
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // babel: {
      //   plugins: [
      //     ["react-compiler", ReactCompilerConfig],
      //   ]
      // }
    }),
    // Put this after all the plugins
    process.env.NODE_ENV === 'production' && sentryVitePlugin({
      org: 'tausi-app',
      project: 'tausi-admin-dashboard',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['./dist/assets/*.map']
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
  },
});
