import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { configDefaults } from 'vitest/config'
import path from 'path'
//
// see https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8081 // @TODO read port from env variable
    },
    test: {
        // make all test functions available without import
        globals: true,
        exclude: [...configDefaults.exclude, '**/*.spec.js'],
    },
    // build: {
    //   rollupOptions: {
    //     input: './src/index.html'
    //   }
    // },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/components'),
            '@w': path.resolve(__dirname, './src/components/widgets'),
            '@p': path.resolve(__dirname, './src/components/pages'),
            '@t': path.resolve(__dirname, './src/components/templates'),
        },
    }
})
