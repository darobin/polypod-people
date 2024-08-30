
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { app }  from 'electron';
import { ctx } from '../index.js';

export function profileDir () {
  return join(app.getPath('userData'), ctx.profile);
}
// function sessionData () { return join(profileDir(), 'session.json'); }

export async function initProfileDir () {
  const dir = profileDir();
  await mkdir(dir, { recursive: true });
}
