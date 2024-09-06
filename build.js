#!/usr/bin/env node
import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import { wasmLoader } from 'esbuild-plugin-wasm';

// esbuild ui/polypod.js --bundle --outfile=ui/polypod.min.js --format=esm
// esbuild ui/polypod.js --bundle --outfile=ui/polypod.min.js --format=esm --watch --sourcemap
const isWatch = argv[2] === '--watch';
const options = {
  entryPoints: ['ui/polypod.js'],
  bundle: true,
  outfile: 'ui/polypod.min.js',
  format: 'esm',
  sourcemap: isWatch,
  plugins: [wasmLoader()],
};

if (isWatch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
}
else {
  esbuild.build(options);
}
