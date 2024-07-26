import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        port: 3000,
        proxy: {
            '/api': {
                // TODO: read from .env
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist/react',
    },
});
