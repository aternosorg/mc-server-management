import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        fileParallelism: true,
        globalSetup: ["test/setup.ts"],
        testTimeout: 15_000,
    },
})
