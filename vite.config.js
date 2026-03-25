import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 方便部署到任何路徑
  build: {
    emptyOutDir: false, // 避免刪除 dist 資料夾時的檔案系統問題
  },
})
