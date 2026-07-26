import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'vite';

const OUT_DIR = new URL('../dist/', import.meta.url);

await build({
  configFile: false,
  logLevel: 'error',
  build: {
    outDir: 'dist/.bookmarklet',
    emptyOutDir: true,
    target: 'es2022',
    minify: 'terser',
    lib: {
      entry: new URL('../src/main.ts', import.meta.url).pathname,
      formats: ['iife'],
      name: 'PokeRogueTierOverlay',
      fileName: () => 'bundle.js',
    },
  },
});

const bundle = readFileSync(new URL('.bookmarklet/bundle.js', OUT_DIR), 'utf8');
const href = `javascript:${encodeURIComponent(bundle)}`;

writeFileSync(new URL('bookmarklet.txt', OUT_DIR), `${href}\n`);

const kilobytes = (value: string) => `${(value.length / 1024).toFixed(1)} kB`;
process.stdout.write(`bookmarklet: ${kilobytes(bundle)} minificado, ${kilobytes(href)} como URL\n`);
