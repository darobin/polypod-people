
// we need this so that it initialises Automerge right
import "@automerge/automerge/next";
import { Repo } from "@automerge/automerge-repo/slim";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { onMount } from 'nanostores';

export const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter(window.polypod.server)],
  storage: new IndexedDBStorageAdapter(),
});

export function nanomerge ($atom, docID) {
  const dh = repo.find(docID);
  onMount($atom, async () => {
    const doc = await dh.doc();
    $atom.set(doc);
    const cb = (doc) => $atom.set(doc);
    dh.on('change', cb);
    return () => dh.off('change', cb);
  });
  return $atom;
}
