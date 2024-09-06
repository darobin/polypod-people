
import { equal, ok, fail } from 'node:assert';
import { makePolypod } from './helpers.js';
import { verifyJWT } from '../lib/jwt.js';

let server, client, repo, shutdownRepo;
before(async () => {
  const details = await makePolypod();
  server = details.server;
  client = details.client;
  repo = details.repo;
  shutdownRepo = details.shutdownRepo;
});
after(async function () {
  await server?.stop(true);
  await shutdownRepo();
  // this is a thing from v2
  // await repo?.shutdown();
});

describe('Polypod Server: Registration', function (){
  this.timeout(10 * 1000);
  it('should reject bad invites', async () => {
    await verifyError('Missing token', makeUser({ token: undefined }), 401, 'Bad invite token');
    await verifyError('Wrong token', makeUser({ token: 'whatever-dude' }), 401, 'Bad invite token');
  });
  it('should reject bad usernames', async () => {
    await verifyError('Missing username', makeUser({ username: undefined }), 400, 'Bad username');
    await verifyError('Wrong username', makeUser({ username: '../../whatever.json' }), 400, 'Bad username');
  });
  it('should reject bad passwords', async () => {
    await verifyError('Missing password', makeUser({ password: undefined }), 400, 'Bad password');
    await verifyError('Wrong password', makeUser({ password: '' }), 400, 'Bad password');
  });
  it('should reject bad names', async () => {
    await verifyError('Missing name', makeUser({ name: undefined }), 400, 'Bad name');
    await verifyError('Wrong name', makeUser({ name: '' }), 400, 'Bad name');
  });
  it('should reject bad emails', async () => {
    await verifyError('Missing email', makeUser({ email: undefined }), 400, 'Bad email');
    await verifyError('Wrong email', makeUser({ email: 'whatever email dot come' }), 400, 'Bad email');
  });
  it('should reject duplicated usernames', async () => {
    const user = makeUser({ username: 'dupe' })
    const res = await client.post('/register', user);
    equal(200, res.status, `User created`);
    equal(true, res.data.ok, `Success`);
    await verifyError('Duplicate user', user, 401, 'User exists');
  });
  it('should accept correct registrations', async () => {
    const user = makeUser();
    const res = await client.post('/register', user);
    equal(200, res.status, `User created`);
    equal(true, res.data.ok, `Success`);
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
  });
});

async function verifyError (label, payload, errorCode, errorMessage) {
  const res = await client.post('/register', payload);
  equal(errorCode, res.status, `Correct error [${label}]`);
  equal(false, res.data.ok, `Correct ok [${label}]`);
  equal(errorMessage, res.data.error, `Correct message [${label}]`);
}

function makeUser (override = {}) {
  return {
    username: 'noodle',
    password: 'hunter2',
    name: 'Noodle',
    email: 'noodle@berjon.com',
    token: server.inviteCode,
    ...override
  };
}
