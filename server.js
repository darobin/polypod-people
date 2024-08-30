
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import express from 'express';
import { PORT } from './shared/constants.js';
import makeRel from './shared/rel.js';

// XXX
// - start server on watch
// - ignore content of data (maybe instead of gitkeep then)
// - connect and store properly
const app = express();
const rel = makeRel(import.meta.url);
await mkdir(rel('data'));

app.get('/', (req, res) => {
  res.send('Polypod operational.');
});

app.listen(PORT, () => {
  console.warn(`Polypod server running at http://localhost:${PORT}`);
});
