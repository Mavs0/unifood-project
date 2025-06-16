import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Expondo o servidor para todas as interfaces de rede
    port: 5176, // Ou qualquer outra porta que você queira
  },
});
