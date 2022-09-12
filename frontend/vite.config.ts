import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

const outDir = "dist";

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [react()],
    build: {
        outDir: outDir,
        rollupOptions: {
            plugins: [
                copy({
                    hook: "closeBundle",
                    targets: [
                        {src: `${outDir}/index.html`, dest: `${outDir}/school-card`},
                    ]
                }),
            ],
        },
    },
})
