import {defineConfig} from 'vitest/config'
import {playwright} from "@vitest/browser-playwright";

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    include: [
                        "test/common/**/*.test.ts",
                        "test/browser/**/*.test.ts",
                    ],
                    name: "browser",
                    browser: {
                        provider: playwright(),
                        enabled: true,
                        headless: true,
                        instances: [
                            { browser: "chromium" },
                        ]
                    },
                },
            },
            {
                test: {
                    include: [
                        "test/node/**/*.test.ts",
                        "test/common/**/*.test.ts",
                    ],
                    name: "node",
                    globalSetup: [
                        "test/node/setup/global.ts",
                    ],
                    setupFiles: [
                        "test/node/setup/connections.ts",
                    ]
                },
            }
        ],
        fileParallelism: true,
        testTimeout: 15_000,
        coverage: {
            include: ["src/**/*.ts"],
        }
    },
})
