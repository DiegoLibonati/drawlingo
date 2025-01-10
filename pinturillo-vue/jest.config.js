export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
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
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vue/test-utils":
      "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
  },
};
