import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// './' keeps asset paths relative so the build works at any GitHub Pages URL
// (the app uses hash routes, so no server-side routing is needed).
export default defineConfig({ base: './', plugins: [react()] });
