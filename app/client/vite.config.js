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
        // @TODO too many aliases? It make the imports less intransparent when
        // reading and does it really save that much typing? 
        alias: {
            '@_': path.resolve(__dirname, './src'),
            '@': path.resolve(__dirname, './src/app/components'),
            '@w': path.resolve(__dirname, './src/app/components/widgets'),
            '@p': path.resolve(__dirname, './src/app/components/pages'),
            '@t': path.resolve(__dirname, './src/app/components/templates'),
            '@u': path.resolve(__dirname, './src/app/components/utils'),
            '@lib': path.resolve(__dirname, './src/lib'),
        },
    }
})
