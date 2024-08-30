
import { atom, computed } from 'nanostores';
import { $loggedIn } from './identity.js';
// import { $router } from './router.js';

const $explicitSideBarShowing = atom(true);
export const $uiSideBarShowing = computed(
  [$loggedIn, $explicitSideBarShowing],
  (loggedIn, explicitSideBarShowing) => loggedIn && explicitSideBarShowing
);

export function showSideBar () { $explicitSideBarShowing.set(true); }
export function hideSideBar () { $explicitSideBarShowing.set(false); }
export function toggleSideBar () { $explicitSideBarShowing.set(!$explicitSideBarShowing.get()); }

export const $uiSideBarButtonShowing = computed([$loggedIn], (loggedIn) => loggedIn);
