import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/action.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})
