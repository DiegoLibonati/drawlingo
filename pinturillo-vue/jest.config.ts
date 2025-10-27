import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg|mp3)$": "<rootDir>/tests_mocks/fileMock.ts",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@vue/test-utils$":
      "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!(monaco-editor)).+\\.js$"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: { VITE_API_URL: "https://www.url.com" },
                },
              },
            },
          ],
        },
      },
    ],
  },
};

export default config;
