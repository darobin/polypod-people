
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

app.get('/person/:handle', async (req, res) => {
  const { handle } = req.params;
  try {
    await readFile(rel(`data/${handle}/public.jwt`));
  }
  catch (err) {
    return res.status(404).send({ ok: false });
  }
  res.send({ ok: true });
});

// Just to be clear: THIS IS COMPLETELY UNSAFE.
// The point here is a working prototype that can demonstrate the interaction and
// potential of the approach. DO NOT USE THIS FOR ANYTHING SERIOUS.
app.post('/person/setup', express.json(), async (req, res) => {
  const { handle, pubKey } = req.body;
  if (!handle || !pubKey) return res.status(400).send({ ok: false, msg: 'Needs handle and pubKey.' });
  if (!/^\w+(?:\.\s+)+$/.test(handle)) return res.status(400).send({ ok: false, msg: 'Bad handle.' });
  const handleDir = rel(`data/${handle}`);
  await mkdir(handleDir);
  await writeFile(join(handleDir, 'public.jwt'), pubKey);
  res.status(201).send({ ok: true });
});

app.listen(PORT, () => {
  console.warn(`Polypod server running at http://localhost:${PORT}`);
});
