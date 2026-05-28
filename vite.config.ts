import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import yaml from '@rollup/plugin-yaml';

export const createViteConfig = (env: Record<string, string> = {}) => ({
  plugins: [vue(), vueJsx(), vueDevTools(), yaml()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ...(env.VITE_API_BASE_URL
    ? {
        server: {
          proxy: Object.fromEntries(
            [
              '/login',
              '/logout',
              '/wifi',
              '/wifi_list',
              '/timezone',
              '/timezone_list',
              '/version',
              '/ap',
              '/homekit',
              '/websocket_api',
              '/ssh_access_enable',
            ].map((path) => [
              path,
              { target: env.VITE_API_BASE_URL, changeOrigin: true, secure: false },
            ]),
          ),
        },
      }
    : {}),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return createViteConfig(env);
});
