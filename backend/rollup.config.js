import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

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
        // resolve({
        //     browser: false,
        // }),
        // commonjs(),
    ],
}
