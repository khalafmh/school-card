const {clean} = require("esbuild-plugin-clean")

require("esbuild").build({
    platform: "node",
    outbase: "src",
    outdir: "dist",
    entryPoints: ["src/main.ts"],
    bundle: true,
    plugins: [clean()],
    watch: process.argv.indexOf("--watch") !== -1
})
