
import { atom, onMount } from 'nanostores';
import { $router } from './router.js';

export const $loggedIn = atom(false);
export const $loginLoading = atom(true);
export const $identities = atom([]);

onMount($loggedIn, async () => {
  if (!$loggedIn.get()) $router.open('/login', true);
  await loadIdentities();
});

export async function loadIdentities () {
  $loginLoading.set(true);
  const res = await window.polypod.loadIdentities();
  $loginLoading.set(false);
  if (res.ok) {
    $loggedIn.set(true);
    $identities.set(res.data);
  }
  else {
    $loggedIn.set(false);
    $identities.set([]);
  }
}
