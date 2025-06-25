import { resolve } from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = {
    BASE_URL: '/',
    BASE_API_URL: '/api/v1/',
    API_URL: null,
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };
  return {
    plugins: [
      react(),
      svgr(),
      // basicSsl(),
      ...(process.env.NODE_ENV === 'development'
        ? []
        : [
            sentryVitePlugin({
              authToken: process.env.SENTRY_AUTH_TOKEN,
              org: 'rydvi',
              project: 'food-stat-react',
            }),
          ]),
    ],
    root: resolve('./'),
    base: '/',
    define: {
      'process.env': env,
    },
    server: {
      open: false,
      proxy: {
        '/api/v1': 'http://djangobackend:8000/',
        '/media': {
          target: 'http://djangobackend:8000/media/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, ''),
        },
      },
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        pages: resolve('./src/pages'),
        app: resolve('./src/app'),
        shared: resolve('./src/shared'),
        features: resolve('./src/features'),
        entities: resolve('./src/entities'),
        widgets: resolve('./src/widgets'),
      },
      extensions: ['.js', '.ts', '.json', '.jsx', '.tsx', '.svg'],
    },
    build: {
      sourcemap: true, // Source map generation must be turned on
      outDir: resolve('./dist'),
      assetsDir: 'assets',
      manifest: 'manifest.json',
      emptyOutDir: true,
      target: 'es2015',
      rollupOptions: {
        input: {
          main: resolve('./index.html'),
        },
        // output: {
        //   chunkFileNames: undefined,
        // },
      },
    },
  };
});
