import { defineConfig } from 'vitest/config';
import GithubActionsReporter from 'vitest-github-actions-reporter';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcovonly'],
      exclude: ['**/*.test.ts', '**/*.fixture.ts'],
    } as any, //eslint-disable-line @typescript-eslint/no-explicit-any
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', new GithubActionsReporter()]
      : 'default',
    environment: 'jsdom',
  },
});
