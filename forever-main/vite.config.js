import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleChatRequest } from './server/server.js'

function abishekAiDevPlugin() {
  return {
    name: 'abishek-ai-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        handleChatRequest(req, res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), abishekAiDevPlugin()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (
            id.includes('node_modules/canvas-confetti') ||
            id.includes('node_modules/html2canvas') ||
            id.includes('node_modules/html-to-image')
          ) {
            return 'vendor-canvas';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
})
