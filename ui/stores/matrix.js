
import { atom, map, onMount } from 'nanostores';
import * as m from 'matrix-js-sdk';

const store = new m.IndexedDBStore({ indexedDB: window.indexedDB, localStorage: window.localStorage });
const client = m.createClient({
  baseUrl: `https://${window.polypod.domain}/`,
  timelineSupport: true,
  store,
});

let clientStarted = false;

export const $syncState = atom(null);
export const $session = atom(null);
export const $rooms = map({});
export const $account = atom(null);

// [
//   $syncState,
//   $rooms,
//   $account,
// ].forEach($obj => onMount($obj, startClient));

const unsubSession = $session.listen(async () => {
  await startClient()
  unsubSession();
});

async function initialiseRooms () {
  const joined = await client.getJoinedRooms();
  console.warn(`Mounted ROOMS:`, joined.joined_rooms);
  joined.joined_rooms.forEach(rid => {
    $rooms.setKey(rid, client.getRoom(rid));
  });
}

client.on("sync", async (state/*, prevState, data*/) => {
  // console.warn(state, prevState, data);
  // console.warn(`SYNC: ${prevState}->${state} (${JSON.stringify(data)})`);
  $syncState.set(state);
  switch (state) {
    case "PREPARED":
      await initialiseRooms();
      break;
  }
});

// Some of these update $account?
// [
//   m.ClientEvent.AccountData,
//   m.ClientEvent.DeleteRoom,
//   // m.ClientEvent.Event,
//   m.ClientEvent.Room,
// ].forEach()

// Some of these update other people?
// [
  // m.UserEvent.AvatarUrl,
  // m.UserEvent.CurrentlyActive,
  // m.UserEvent.DisplayName,
  // m.UserEvent.Presence,
// ].forEach()

// The below is a WILD GUESS.
[
  m.RoomState.events,
].forEach(eventName => {
  client.on(eventName, (mev) => {
    console.warn(`on ${eventName}`, mev.event);
    if (mev?.event?.room_id) $rooms.setKey(mev.event.room_id, client.getRoom(mev.event.room_id));
  });
});
// m.RoomStateEvent.Update,
// m.RoomEvent.Tags,
// m.RoomEvent.Summary,
// m.RoomEvent.AccountData,
// m.RoomEvent.CurrentStateUpdated,
// m.RoomEvent.Timeline,
// m.RoomMemberEvent.Membership,
// m.RoomMemberEvent.Name,
// m.RoomStateEvent.Events,
// m.RoomStateEvent.Members,
// m.RoomStateEvent.NewMember,
// m.RoomEvent.Name,
// m.RoomEvent.MyMembership,

// This throws when it fails. Handle at caller.
export async function login (usr, pwd) {
  const sess = await client.loginWithPassword(`@${usr}:${window.polypod.domain}`, pwd);
  $session.set(sess);
}

// Throws.
export async function register (user, password, token, email) {
  if ([user, password, token, email].find(x => !x)) {
    console.warn(user, password, token, email);
    throw new Error(`All of user, password, token, and email must be provided.`);
  }
  const sess = await client.register(
    user,
    password, 
    null,
    { type: 'm.login.registration_token', token },
    { email }
  );
  $session.set(sess);
}

export async function startClient () {
  if (clientStarted) return;
  clientStarted = true;
  await store.startup();
  await client.startClient({ initialSyncLimit: 100 });
}

export function stopClient () {
  client.stopClient();
  clientStarted = false;
}
