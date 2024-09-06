
import { equal } from 'node:assert';
import { makePolypod } from './helpers.js';

const { client, cleanup, makeUser, checkLoggedInUser } = await makePolypod();
after('cleaning up', cleanup);
const user = makeUser();
const credentials = { username: user.username, password: user.password };
before(async () => {
  await client.post('/register', user);
});

describe('Polypod Server: Login', function () {
  this.timeout(10 * 1000);
  it('should reject wrong credentials', async () => {
    await verifyError('Missing username', { ...credentials, username: undefined });
    await verifyError('Bad username', { ...credentials, username: '../../whoopsie.exe' });
    await verifyError('No such user', { ...credentials, username: 'whodisnewphone' });
    await verifyError('Wrong password', { ...credentials, password: '********' });
  });
  it('should accept good credentials', async () => {
    const res = await client.post('/login', credentials);
    equal(200, res.status, `User created`);
    equal(true, res.data.ok, `Success`);
    checkLoggedInUser(res, user);
  });
});

async function verifyError (label, creds) {
  const res = await client.post('/login', creds);
  equal(401, res.status, `Correct error [${label}]`);
  equal(false, res.data.ok, `Correct ok [${label}]`);
  equal('Wrong username or password', res.data.error, `Correct message [${label}]`);
}
