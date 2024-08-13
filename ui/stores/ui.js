
import { atom, computed, action } from 'nanostores';
import { $loggedIn } from './identities.js';
// import { $router } from './router.js';

const $explicitSideBarShowing = atom(true);
export const $uiSideBarShowing = computed(
  [$loggedIn, $explicitSideBarShowing],
  (loggedIn, explicitSideBarShowing) => loggedIn && explicitSideBarShowing
);

export const showSideBar = action($explicitSideBarShowing, 'showSideBar', (store) => store.set(true));
export const hideSideBar = action($explicitSideBarShowing, 'hideSideBar', (store) => store.set(false));
export const toggleSideBar = action($explicitSideBarShowing, 'toggleSideBar', (store) => store.set(!store.get()));
