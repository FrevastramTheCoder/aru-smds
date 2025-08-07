// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//     },
//   },
// });

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000', // your backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend API server
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
