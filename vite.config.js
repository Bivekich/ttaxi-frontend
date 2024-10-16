import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Позволяет использовать любой хост
    port: 5713, // Основной порт для разработки, можно изменить при необходимости
    hmr: {
      protocol: "ws", // Протокол для HMR (горячая перезагрузка модулей)
    },
    proxy: {
      // Настройка для subdomain: admin.localhost
      "/admin": {
        target: "http://admin.localhost:5713",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
      },
      // Настройка для subdomain: client.localhost
      "/client": {
        target: "http://client.localhost:5713",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/client/, ""),
      },
      // Настройка для subdomain: driver.localhost
      "/driver": {
        target: "http://driver.localhost:5713",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/driver/, ""),
      },
    },
  },
});
