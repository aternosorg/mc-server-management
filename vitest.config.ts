import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        fileParallelism: true,
        include: ["test/**/*.test.ts"],
        globalSetup: ["test/setup.ts"],
    },
})
