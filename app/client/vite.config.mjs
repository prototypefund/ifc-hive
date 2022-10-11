import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { configDefaults } from 'vitest/config'
import path from 'path'


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//
// see https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8081 // @TODO read port from env variable
    },
    test: {
        enviroment: "happy-dom",
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
            '@u': path.resolve(__dirname, './src/components/utils'),
            '@lib': path.resolve(__dirname, './src/lib'),
        },
    }
})
