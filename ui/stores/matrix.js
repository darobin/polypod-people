
import { atom, onMount } from 'nanostores';
import * as m from 'matrix-js-sdk';

const client = m.createClient({
  baseUrl: `https://${window.polypod.domain}/`,
  timelineSupport: true,
});

export const $syncState = atom(null);
export const $session = atom(null);

client.on("sync", async (state/*, prevState, data*/) => {
  // console.warn(`SYNC: ${prevState}->${state} (${JSON.stringify(data)})`);
  $syncState.set(state);
  switch (state) {
    case "PREPARED":
      // await sendChat();
      // await listRooms();
      // await createRoom();
      // await listRooms();
      // await postEvent();
      // await showTimeline();
      // client.stopClient();
      break;
  }
});

onMount($syncState, async () => {
  await client.startClient({ initialSyncLimit: 100 });
});

// This throws when it fails. Handle at caller.
export async function login (usr, pwd) {
  const sess = await client.loginWithPassword(`@${usr}:${window.polypod.domain}`, pwd);
  $session.set(sess);
}

export function stopClient () {
  client.stopClient();
}
