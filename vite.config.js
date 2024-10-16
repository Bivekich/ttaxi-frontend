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
        target: "https://admin.24t-taxi.ru",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
      },
      // Настройка для subdomain: client.localhost
      "/client": {
        target: "https://client.24t-taxi.ru",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/client/, ""),
      },
      // Настройка для subdomain: driver.localhost
      "/driver": {
        target: "https://driver.24t-taxi.ru",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/driver/, ""),
      },
    },
  },
});
