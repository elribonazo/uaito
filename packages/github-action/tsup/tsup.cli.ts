import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  outDir: 'build',
  target: 'node18',
  platform: 'node',
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
  external: ['@uaito/ai', '@uaito/sdk', '@octokit/rest', '@actions/core', '@actions/github'],
});
