import { defineConfig } from 'vitest/config';
import GithubActionsReporter from 'vitest-github-actions-reporter';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcovonly'],
      exclude: ['**/*.test.ts'],
    },
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', new GithubActionsReporter()]
      : 'default',
  },
});
