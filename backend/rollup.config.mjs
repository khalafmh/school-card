import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
    input: ["src/main.ts"],
    output: {
        dir: "dist",
        format: "cjs",
        sourcemap: "inline",
    },
    plugins: [
        typescript(),
        json(),
    ],
}
