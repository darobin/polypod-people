
import { join } from 'node:path';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import getPort from 'get-port';
import axios from 'axios';
import { Repo } from "@automerge/automerge-repo/slim";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { WebSocket } from 'ws';
import { INVITE_CODE, JWT_SECRET } from '../shared/constants.js';
import PolypodAPIServer from '../lib/api-server.js';

export async function makePolypod () {
  const port = await getPort();
  const dir = await mkdtemp(join(tmpdir(), 'polypod-'));
  await mkdir(dir, { recursive: true });
  const server = new PolypodAPIServer({
    dir, 
    port,
    inviteCode: INVITE_CODE,
    jwtSecret: JWT_SECRET,
  });
  await server.run();
  const client = axios.create({
    baseURL: `http://localhost:${port}/api/`,
    validateStatus: () => true,
  });
  const bws = new BrowserWebSocketClientAdapter(`ws://localhost:${port}`);
  const repo = new Repo({
    peerId: 'polypod-test-helper',
    network: [bws],
    // storage: new IndexedDBStorageAdapter(),
  });
  const shutdownRepo = async () => {
    if (bws.socket) {
      if (bws.socket.readyState === WebSocket.CONNECTING) bws.socket.emitClose();
      else bws.socket?.terminate();
    }
  };
  return { server, port, client, repo, shutdownRepo };
}
