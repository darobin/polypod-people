
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';

export const $loggedIn = atom(false);
export const $logingLoading = atom(true);

onMount($loggedIn, async () => {
  if (!$loggedIn.get()) $router.open('/login', true);
  await loadIdentities();
});

export async function loadIdentities () {
  // XXXX
  // - need to set up window.polypod to call window.polypod.loadIdentities() on it
  // - the backend does whatever it needs to do to give us identities, or nothing (store them obvi)
  // - loggedIn to true
  // - loginLoading to false
}
