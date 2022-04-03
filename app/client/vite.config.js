import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// see https://vitejs.dev/config/
export default defineConfig({
    server: {
    port: 8081 // @TODO read port from env variable
  },
  // build: {
  //   rollupOptions: {
  //     input: './src/index.html'
  //   }
  // },
  plugins: [vue()]
})
