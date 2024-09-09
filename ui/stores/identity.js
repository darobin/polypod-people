
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';
import { client } from '../lib/api-client.js';
import { repo } from '../lib/automerge.js';


// XXX
// - expose a store to the person that pulls from automerge
// - THEN do pods

export const $loggedIn = atom(false);
export const $loginLoading = atom(true);
export const $loginError = atom(false);
export const $registrationError = atom(false);

export function setLoggedIn (documentId) {
  $loginLoading.set(false);
  $loggedIn.set(documentId);
}
export function setLoggedOut () {
  $loginLoading.set(false);
  $loggedIn.set(false);
}

// NOTE
// Calling $router.open() is a code smell. The route should be computed from the state.
// It's not 100% clear how to do that correctly from nanostore, but this needs to be
// fixed.

onMount($loggedIn, async () => {
  const leave = () => $router.open('/login', true);
  const creds = await window.polypod.getCredentials();
  if (!creds) {
    setLoggedOut();
    return leave();
  }
  try {
    const user = await apiLogin(creds.user, creds.password);
    setLoggedIn(user.documentId);
    $router.open('/', true);
  }
  catch (err) {
    setLoggedOut();
    $loginError.set(`Automatic login failed: ${err.message}.`);
    return leave();
  }
});

export const $user = atom(false);
// ENCAPSULATE THIS LATER
// Managing the nanostore+automerge lifecycle is a little tricky
let userDH;
$loggedIn.subscribe(async (docID) => {
  const cb = (doc) => $user.set(doc);
  if (!docID) {
    if (userDH) userDH.off('change', cb);
    $user.set(false);
    return;
  }
  userDH = repo.find(docID);
  const doc = await userDH.doc();
  $user.set(doc);
  userDH.on('change', cb);
});

// This is a different login from the one in matrix: it interacts with that but ALSO
// save credentials to the backend on success and manages identity state.
export async function login (usr, pwd) {
  $loginError.set(false);
  try {
    const user = await apiLogin(usr, pwd);
    setLoggedIn(user.documentId);
    await window.polypod.setCredentials(usr, pwd);
    $router.open('/', true);
  }
  catch (err) {
    setLoggedOut();
    $loginError.set(`Login failed: ${err.message}.`);
  }
}

// This is also a different register from the one in matrix.
export async function register (usr, pwd, token, name, email) {
  $registrationError.set(false);
  try {
    const user = await apiRegister(usr, pwd, token, name, email);
    setLoggedIn(user.documentId);
    await window.polypod.setCredentials(usr, pwd);
    $router.open('/', true);
  }
  catch (err) {
    setLoggedOut();
    $registrationError.set(`Registration failed: ${err.message}.`);
  }
}

export async function logout () {
  $loginError.set(false);
  setLoggedOut();
  $router.open('/login', true);
}

async function apiLogin (username, password) {
  const res = await client.post('/login', { username, password });
  if (res.data?.ok) return res.data.data;
  throw new Error(res.data.error);
}

async function apiRegister (username, password, token, name, email) {
  const res = await client.post('/register', { username, password, name, email, token });
  if (res.data?.ok) return res.data.data;
  throw new Error(res.data.error);
}
