// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');


    const GSCRIPT_BASE_URL = env.VITE_GSCRIPT_BASE_URL;


    return {
        plugins: [
            tailwindcss(),
            react(),
            legacy({
                targets: ['defaults', 'not IE 11'],
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: 'https://script.google.com',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (p) => p.replace(/^\/api/, `/macros/s/${GSCRIPT_BASE_URL}/exec`),
                },
                '/api/google': {
                    target: 'https://script.google.com',
                    changeOrigin: true,
                    secure: false,
                    rewrite: () => `/macros/s/${GSCRIPT_BASE_URL}/exec`,
                },
            },
        },
        build: {
            target: ['es2015'],
        },
    };
});