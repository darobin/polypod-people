
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';
import { login as matrixLogin } from './matrix.js';
import { matrixErrorToMessage } from '../lib/errors.js';

export const $loggedIn = atom(false);
export const $loginLoading = atom(true);
export const $loginError = atom(false);

onMount($loggedIn, async () => {
  const leave = () => $router.open('/login', true);
  const creds = await window.polypod.getCredentials();
  console.warn(creds);
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
    return leave();
  }
});

// this is a different login from the one in matrix: it interacts with that but ALSO
// save credentials to the backend on success and manages identity state.
export async function login (usr, pwd) {
  $loginError.set(false);
  try {
    const success = await matrixLogin(usr, pwd);
    $loggedIn.set(success);
    $loginLoading.set(false);
    await window.polypod.setCredentials(usr, pwd);
  }
  catch (err) {
    $loginError.set(`Login failed: ${matrixErrorToMessage(err)}.`);
  }
}
