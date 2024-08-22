import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'], // Инъекция Buffer в глобальную область видимости
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer/', // Подключение модуля buffer
    },
  },
})