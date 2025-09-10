import {defineConfig} from 'tsdown'

export default defineConfig({
    clean: true,
    dts: true,
    sourcemap: true,
    treeshake: true,
    attw: true,
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    exports: true,
    minify: true,
    unused: true,
    outExtensions: ({format}) => ({
        js: `.${format === "cjs" ? "cjs" : "mjs"}`,
    }),
    ignoreWatch: ['server/**', 'scripts/**', 'tests/**', 'docs/**', 'examples/**', 'node_modules/**' ],
});
