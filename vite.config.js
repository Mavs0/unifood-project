import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET = "https://unifood-aaa0f.web.app";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Não reescreve para evitar duplicar "/api"
      },
    },
  },
});
