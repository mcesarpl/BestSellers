module.exports = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jest-environment-node",
  testMatch: [
    "**/__tests__/**/*.test.js?(x)",
  ],
};
