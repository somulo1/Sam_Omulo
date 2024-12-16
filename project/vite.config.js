import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0].toString(); // Split by module
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Set to your desired limit in kB
  },
});
