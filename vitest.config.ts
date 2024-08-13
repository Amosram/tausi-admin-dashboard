import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
    test: {
       environment: 'jsdom',
       root: './src',
       setupFiles: [
         "vitest.setup.ts"
       ]
    }
});
