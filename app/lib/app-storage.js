
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { app }  from 'electron';
import { ctx } from '../index.js';
import loadJSON from './load-json.js'
import saveJSON from './save-json.js'


export function profileDir () {
  return join(app.getPath('userData'), ctx.profile);
}
// function sessionData () { return join(profileDir(), 'session.json'); }
function identitiesData () { return join(profileDir(), 'identities.json'); }

export async function initProfileDir () {
  const dir = profileDir();
  await mkdir(dir, { recursive: true });
}

export async function saveIdentities () {
  if (!ctx.identities) return;
  await saveJSON(identitiesData(), ctx.identities);
}

export async function loadIdentities (force) {
  if (ctx.identities && !force) return ctx.identities;
  try {
    ctx.identities = await loadJSON(identitiesData());
  }
  catch (err) {
    ctx.identities = undefined;
  }
  return ctx.identities;
}
