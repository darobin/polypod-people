
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';
import { login as matrixLogin } from './matrix.js';

export const $loggedIn = atom(false);
export const $loginLoading = atom(true);

onMount($loggedIn, async () => {
  const leave = () => $router.open('/login', true);
  const creds = await window.polypod.getCredentials();
  if (!creds) return leave();
  const session = await matrixLogin(creds.user, creds.password);
  // XXX this is NOT THE API
  if (!session.ok) return leave();
  // XXX
  // - success: go to /
  // - mount $syncState in home
});

// this is a different login from the one in matrix: it interacts with that but ALSO
// save credentials to the backend on success and manages identity state.
export async function login (usr, pwd) {
  const success = await matrixLogin(usr, pwd);
  $loggedIn.set(success);
  $loginLoading.set(false);
  if (!success) return;
  await window.polypod.setCredentials(usr, pwd);
}
