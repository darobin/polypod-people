
import keychain from 'keychain';
import { AtpAgent } from '@atproto/api';
import { ctx } from '../index.js';
import { saveIdentities } from './app-storage.js';

const service = 'space.polypod';
const type = 'generic';

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
    ctx.profile = await agent.getProfile({ actor: user });    
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
