
import { subtle } from 'node:crypto';
import { readFile, writeFile } from "node:fs/promises";
import keychain from 'keychain';
import { AtpAgent } from '@atproto/api';
import { ctx } from '../index.js';
import { saveIdentities, publicKeyData } from './app-storage.js';
import { personHasHandle, personSetup } from './remote.js';

const service = 'space.polypod';
const type = 'generic';
const keyParams = { name: 'ECDA', namedCurve: 'P-521' };
const keyExtractable = true;
const keyUsages = ['encrypt', 'decrypt', 'deriveKey', 'sign', 'verify'];

export const agent = new AtpAgent({ service: 'https://bsky.social' });

export async function getBlueskyCredentials () {
  return new Promise((resolve, reject) => {
    if (!ctx.identities?.blueskyAccount) reject(new Error('No Bluesky account.'))
    keychain.getPassword(
      { account: ctx.identities.blueskyAccount, service, type }, 
      (err, pwd) => err ? reject(err) : resolve({ user: ctx.identities.blueskyAccount, password: pwd })
    );
  });
}

export async function setBlueskyCredentials (user, password) {
  try {
    await agent.login({ identifier: user, password });
  }
  catch (err) {
    return err;
  }
  if (!ctx.identities) ctx.identities = {};
  ctx.identities.blueskyAccount = user;
  try {
    ctx.identities.profile = await agent.getProfile({ actor: user });    
  }
  catch (err) {
    return err;
  }
  await saveIdentities();
  return new Promise((resolve, reject) => {
    keychain.setPassword(
      { account: ctx.identities.blueskyAccount, service, type, password }, 
      (err) => err ? reject(err) : resolve(ctx.identities.profile)
    );
  });
}

export async function profileKeyPair () {
  if (!ctx.identities?.blueskyAccount) return new Error('No Bluesky account.');
  const account = `${ctx.identities.blueskyAccount}-private-key`;
  return new Promise((resolve) => {
    keychain.getPassword(
      { account, service, type }, 
      async (err, key) => {
        try {
          if (err) throw err;
          const pubKey = await readFile(publicKeyData());
          const privateKey = await subtle.importKey('jwk', key, keyParams, keyExtractable, keyUsages);
          const publicKey = await subtle.importKey('jwk', pubKey, keyParams, keyExtractable, keyUsages);
          ctx.keyPair = { privateKey, publicKey };
          resolve({ privateKey, publicKey });
        }
        catch (err) {
          const keyPair = await subtle.generateKey(keyParams, keyExtractable, keyUsages);
          await writeFile(publicKeyData(), await subtle.exportKey('jwk', keyPair.publicKey));
          await new Promise((resolve, reject) => {
            keychain.setPassword(
              { account, service, type, password: keyPair.privateKey }, 
              (err) => err ? reject(err) : resolve(keyPair)
            );
          });
        }
      }
    );
  });
}

export async function publishUser () {
  if (!ctx.identities?.blueskyAccount) return new Error('No Bluesky account.');
  if (!ctx.keyPair?.publicKey) return new Error('No public key.');
  const hasPerson = await personHasHandle(ctx.identities.blueskyAccount);
  if (hasPerson) return true;
  const success = await personSetup(ctx.identities.blueskyAccount, ctx.keyPair.publicKey);
  return success;
}
