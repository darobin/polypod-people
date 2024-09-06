
import { equal } from 'node:assert';
import { makePolypod } from './helpers.js';

const { client, cleanup, makeUser, checkLoggedInUser } = await makePolypod();
after('cleaning up', cleanup);

describe('Polypod Server: Registration', function () {
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
    await checkLoggedInUser(res, user);
  });
});

async function verifyError (label, payload, errorCode, errorMessage) {
  const res = await client.post('/register', payload);
  equal(errorCode, res.status, `Correct error [${label}]`);
  equal(false, res.data.ok, `Correct ok [${label}]`);
  equal(errorMessage, res.data.error, `Correct message [${label}]`);
}
