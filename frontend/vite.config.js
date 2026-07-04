import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  server: {
    port: 3000,
    host: true
  },
  worker: {
    format: 'es',
    plugins: () => [
      wasm(),
      topLevelAwait()
    ]
  },
  optimizeDeps: {
    exclude: ['@cofhe/sdk', 'tfhe', 'node-tfhe'],
    include: ['tweetnacl', 'iframe-shared-storage']
  }
});
