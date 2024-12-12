import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      axios: 'axios', // No need to use require.resolve
    },
  },
  plugins: [react()],
  define: {
    global: "window", // Redefine `global` para `window` para ambientes de navegador
  },
});
