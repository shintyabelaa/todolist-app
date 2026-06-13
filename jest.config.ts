import nextJest from "next/jest.js"; // Explicitly add .js extension

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  testEnvironment: "jest-environment-jsdom", // Explicitly use the full package name

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
