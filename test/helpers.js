
import { equal, ok, fail } from 'node:assert';
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
import { verifyJWT } from '../lib/jwt.js';

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
  const makeUser = (override = {}) => {
    return {
      username: 'noodle',
      password: 'hunter2',
      name: 'Noodle',
      email: 'noodle@berjon.com',
      token: server.inviteCode,
      ...override
    };
  };
  // NOTE: this is not cleaning up hard enough and we have to run Mocha with --exit
  // It is likely that we test things faster than they are done setting up, and that
  // is making it harder to shut them down cleanly. Also Automerge v2 isn't there yet
  // and that's the version that can really shut the repo down.
  const cleanup = async () => {
    await server?.stop(true);
    await shutdownRepo();
    // this is a thing from v2
    // await repo?.shutdown();  
  };

  const checkLoggedInUser = async (res, user) => {
    try {
      const decoded = await verifyJWT(res.data?.data?.jwt, server.jwtSecret);
      ok(decoded.documentId, 'has a document ID');
      equal(res.data.data.documentId, decoded.documentId, 'document IDs match');
    }
    catch (err) {
      console.warn(err);
      fail('JWT verification failed.');
    }
    const dh = repo.find(res.data.data.documentId);
    await dh.whenReady(['ready', 'deleted']);
    ok(dh.inState(['ready']), `User document is available`);
    const doc = await dh.doc();
    equal(user.name, doc.name, 'Names match');
    await new Promise((resolve) => {
      const newName = 'Mr. Noodle';
      dh.on('change', ({ doc: newDoc }) => {
        equal(newName, newDoc.name, 'Name has changed');
        resolve();
      });
      dh.change((d) => d.name = newName);
    });
  };
  return { server, port, client, repo, cleanup, makeUser, checkLoggedInUser  };
}
