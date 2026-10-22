import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import inlineEditPlugin from './plugins/visual-editor/vite-plugin-react-inline-editor.js';
import editModeDevPlugin from './plugins/visual-editor/vite-plugin-edit-mode.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';
import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import pocketbaseAuthPlugin from './plugins/vite-plugin-pocketbase-auth.js';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [
    ...(isDev
      ? [
          inlineEditPlugin(),
          editModeDevPlugin(),
          selectionModePlugin(),
          iframeRouteRestorationPlugin(),
          pocketbaseAuthPlugin(),
        ]
      : []),
    react(),
  ],
  server: {
    host: '::',
    port: 3000,
    fs: {
      strict: true,
      allow: [
        path.resolve(import.meta.dirname),
        path.join(path.resolve(import.meta.dirname, '../..'), 'node_modules'),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    emptyOutDir: true,
  },
});
