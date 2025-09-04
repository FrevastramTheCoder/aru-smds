// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import commonjs from 'vite-plugin-commonjs';

// export default defineConfig({
//   plugins: [
//     react(),
//     commonjs(), // fixes default import issues for CommonJS modules like leaflet-draw
//   ],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000', // backend API server
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//     },
//   },
//   build: {
//     chunkSizeWarningLimit: 1500, // increases bundle size warning limit (in KB)
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             // Split vendor modules into separate chunks
//             return 'vendor';
//           }
//         },
//       },
//     },
//   },
//   optimizeDeps: {
//     include: ['leaflet', 'leaflet-draw', 'react-leaflet', 'react-leaflet-draw'],
//   },
// });
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    outDir: 'dist',     // important
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['leaflet', 'leaflet-draw', 'react-leaflet', 'react-leaflet-draw'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/',  // important for SPA on Vercel
});
