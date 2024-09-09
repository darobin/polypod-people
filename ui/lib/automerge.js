
// we need this so that it initialises Automerge right
import "@automerge/automerge/next";
import { Repo } from "@automerge/automerge-repo/slim";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

export const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter(window.polypod.server)],
  storage: new IndexedDBStorageAdapter(),
});
