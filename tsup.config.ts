import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm', 'cjs'],
  shims: true,
} satisfies Options);
