
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';
import { login as matrixLogin, register as matrixRegister } from './matrix.js';
import { matrixErrorToMessage } from '../lib/errors.js';

export const $loggedIn = atom(false);
export const $loginLoading = atom(true);
export const $loginError = atom(false);
export const $registrationError = atom(false);

// NOTE
// Calling $router.open() is a code smell. The route should be computed from the state.
// It's not 100% clear how to do that correctly from nanostore, but this needs to be
// fixed.

onMount($loggedIn, async () => {
  const leave = () => $router.open('/login', true);
  const creds = await window.polypod.getCredentials();
  if (!creds) {
    $loginLoading.set(false);
    return leave();
  }
  try {
    await matrixLogin(creds.user, creds.password);
    $router.open('/', true);
  }
  catch (err) {
    // We don't use the error here but we could in order to separate time outs from
    // credential changes that could trigger failure.
    $loginLoading.set(false);
    $loggedIn.set(false);
    $loginError.set(`Automatic login failed: ${matrixErrorToMessage(err)}.`);
    return leave();
  }
});

// This is a different login from the one in matrix: it interacts with that but ALSO
// save credentials to the backend on success and manages identity state.
export async function login (usr, pwd) {
  $loginError.set(false);
  try {
    await matrixLogin(usr, pwd);
    $loggedIn.set(true);
    $loginLoading.set(false);
    await window.polypod.setCredentials(usr, pwd);
    $router.open('/', true);
  }
  catch (err) {
    $loggedIn.set(false);
    $loginError.set(`Login failed: ${matrixErrorToMessage(err)}.`);
  }
}

// This is also a different register from the one in matrix.
export async function register (usr, pwd, token, email) {
  $registrationError.set(false);
  try {
    await matrixRegister(usr, pwd, token, email);
    $loggedIn.set(true);
    $loginLoading.set(false);
    await window.polypod.setCredentials(usr, pwd);
    $router.open('/', true);
  }
  catch (err) {
    $loggedIn.set(false);
    $registrationError.set(`Registration failed: ${matrixErrorToMessage(err)}.`);
  }
}
