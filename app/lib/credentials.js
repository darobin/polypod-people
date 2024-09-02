
import keytar from 'keytar';

const service = 'space.polypod';

export async function getCredentials () {
  const creds = await keytar.findCredentials(service);
  if (creds?.length) {
    if (creds.length > 1) {
      console.warn(`There are ${creds.length} credentials stored for ${service} but Polypod only handles one.`);
    }
    return { user: creds[0].account, password: creds[0].password };
  }
  else {
    return null;
  }
}

export async function setCredentials (user, password) {
  await keytar.setPassword(service, user, password);
}
