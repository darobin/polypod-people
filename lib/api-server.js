
import { mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { hostname } from "node:os";
import { nextTick } from 'node:process';
import express from 'express';
import * as ev from 'email-validator';
import { Repo } from "@automerge/automerge-repo";
import { WebSocketServer } from "ws";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { NodeFSStorageAdapter } from "@automerge/automerge-repo-storage-nodefs";
import { hashPassword, checkPassword } from './passwords.js';
import { issueJWT } from './jwt.js';
import { createPerson } from './automerge-types.js';
import saveJSON from '../shared/save-json.js';
import loadJSON from '../shared/load-json.js';

export default class PolypodAPIServer {
  constructor (config) {
    ['dir', 'port', 'inviteCode', 'jwtSecret'].forEach(k => {
      if (!config[k]) throw new Error(`PolypodAPIServer must be configured with ${k}.`);
      this[k] = config[k];
    });
    this.accountsDir = join(this.dir, 'accounts');
    this.automergeDir = join(this.dir, 'automerge');
  }
  async run (cb) {
    await Promise.all([this.dir, this.accountsDir, this.automergeDir].map(d => mkdir(d, { recursive: true })));
    const app = express();
    this.server = app.listen(this.port, cb);
    this.wss = new WebSocketServer({ server: this.server });
    this.repo = new Repo({
      network: [new NodeWSServerAdapter(this.wss)],
      storage: new NodeFSStorageAdapter(this.automergeDir),
      peerId: `polypod-server-${hostname()}`,
    });

    app.get('/', (req, res) => {
      res.send('Polypod operational.');
    });
    
    app.post('/api/register', express.json(), async (req, res) => {
      let { username, password, token, email, name } = req.body;
      username = username?.toLowerCase();
      if (token !== this.inviteCode) return fail(res, 'Bad invite token', 401);
      if (!this.validateUsername(username)) return fail(res, 'Bad username');
      if (!password?.length) return fail(res, 'Bad password');
      if (!name?.length) return fail(res, 'Bad name');
      if (!ev.validate(email)) return fail(res, 'Bad email');
      const userPath = this.userPath(username);
      if (await exists(userPath)) return fail(res, 'User exists', 401);
      const p = await createPerson(this.repo, { name, username });
      await saveJSON(userPath, {
        username,
        email,
        password: await hashPassword(password),
        documentId: p.documentId,
      });
      const jwt = await issueJWT({ documentId: p.documentId }, this.jwtSecret);
      success(res, { jwt, documentId: p.documentId });
    });

    app.post('/api/login', express.json(), async (req, res) => {
      let { username, password } = req.body;
      const errMsg = 'Wrong username or password';
      username = username?.toLowerCase();
      if (!this.validateUsername(username)) return fail(res, errMsg, 401);
      const userPath = this.userPath(username);
      try {
        const user = await loadJSON(userPath);
        if (!await checkPassword(password, user.password)) return fail(res, errMsg, 401);
        // We don't check that automerge knows about it
        // const dh = this.repo.find(user.documentId);
        // await dh.whenReady(); // checking that it exists in some form
        const jwt = await issueJWT({ documentId: user.documentId }, this.jwtSecret);
        success(res, { jwt, documentId: user.documentId });
      }
      catch (err) {
        fail(res, errMsg, 401);
      }
    });
  }

  async stop (force) {
    return Promise.all(
      [this.server, this.wss].map(s => new Promise((resolve, reject) => {
        s.close((err) => {
          if (err) return reject(err);
          resolve();
        });
        if (force) nextTick(() => s.emit('close'));
        this.app = null;
        this.server = null;
        this.wss = null;
      })
    ));
  }

  userPath (username) {
    return join(this.accountsDir, `${username}.json`);
  }
  validateUsername (username) {
    return username && /^\w[\w.\-_]*$/.test(username);
  }
}

function success (res, data, status = 200) {
  res.status(status).json({ ok: true, data });
}
function fail (res, error, status = 400) {
  res.status(status).json({ ok: false, error });
}

async function exists (path) {
  try {
    await access(path);
    return true;
  }
  catch (err) {
    return false;
  }
}
