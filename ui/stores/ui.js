
import { atom, computed } from 'nanostores';
import { $loggedIn } from './identity.js';
import { repo } from "../lib/automerge.js";

const $explicitSideBarShowing = atom(true);
export const $uiSideBarShowing = computed(
  [$loggedIn, $explicitSideBarShowing],
  (loggedIn, explicitSideBarShowing) => loggedIn && explicitSideBarShowing
);

export function showSideBar () { $explicitSideBarShowing.set(true); }
export function hideSideBar () { $explicitSideBarShowing.set(false); }
export function toggleSideBar () { $explicitSideBarShowing.set(!$explicitSideBarShowing.get()); }

export const $uiSideBarButtonShowing = computed([$loggedIn], (loggedIn) => loggedIn);

export const $uiAddingPod = atom(false);
export function showAddingPod () { $uiAddingPod.set(true); }
export function hideAddingPod () { $uiAddingPod.set(false); }

export const $uiSelectedPodID = atom(false);
export function selectPod (pid) { $uiSelectedPodID.set(pid); }
export const $uiSelectedPod = atom(false);
$uiSelectedPodID.subscribe(async (pid) => {
  if (!pid) return $uiSelectedPod.set(false);
  const dh = repo.find(pid);
  await dh.whenReady();
  $uiSelectedPod.set(await dh.doc());
});
