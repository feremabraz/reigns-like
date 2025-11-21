import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['electron/main.ts'],
  outDir: 'dist/electron',
  format: 'cjs',
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  dts: false,
  target: 'node20',
  platform: 'node',
  shims: false,
  external: ['electron'],
});
