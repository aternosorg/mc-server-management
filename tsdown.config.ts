import {defineConfig} from 'tsdown'
import type { UserConfig } from 'tsdown';
import { access } from "node:fs/promises";
import { F_OK } from "node:constants";

const config: UserConfig = [{
    name: 'Main build',
    dts: true,
    sourcemap: true,
    treeshake: true,
    attw: true,
    entry: [
        './src/index.node.ts',
        './src/index.browser.ts',
    ],
    format: ['cjs', 'esm'],
    minify: false,
    unused: true,
    outExtensions: ({format}) => ({
        js: `.${format === "cjs" ? "cjs" : "mjs"}`,
    }),
    ignoreWatch: ['server/**', 'scripts/**', 'tests/**', 'docs/**', 'examples/**', 'node_modules/**' ],
}];

const devConfig: UserConfig = {
    name: 'dev test file',
    dts: false,
    entry: './test.ts',
    outDir: 'dist',
    format: "esm"
};

if (typeof devConfig.entry === 'string' && await access(devConfig.entry, F_OK)
    .then(() => true)
    .catch(() => false)) {
    config.push(devConfig);
}

export default defineConfig(config);
