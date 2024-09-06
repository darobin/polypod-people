
import { next as am } from "@automerge/automerge";
import { nanoid } from "nanoid";

export async function createPerson (repo, person) {
  const dh = repo.create({
    name: new am.RawString(person.name || 'Anonymous Friend'),
    username: new am.RawString(person.username || ''),
    pods: [],
  });
  await dh.whenReady();
  return dh;
}

export async function createPod (repo, pod, personHandle) {
  if (!personHandle) throw new Error ('Cannot create pod without owning person');
  const dh = repo.create({
    name: new am.RawString(pod.name || 'Nameless Pod'),
    docs: [],
  });
  await dh.whenReady();
  await asyncChange(personHandle, (person) => {
    const id = dh.documentId;
    if (person.pods?.find(pid => pid === id)) return;
    if (!person.pods) person.pods = [id];
    else person.pods.push(id);
  });
  return dh;
}

export async function createDoc (repo, doc, podHandle, tileID) {
  if (!podHandle) throw new Error ('Cannot create doc without owning pod');
  if (!tileID) throw new Error ('Cannot create doc without handling tile');
  const dh = repo.create({
    name: new am.RawString(doc.name || 'Untitled Document'),
    tileID,
  });
  await dh.whenReady();
  await asyncChange(podHandle, (pod) => {
    const id = dh.documentId;
    if (pod.docs?.find(pid => pid === id)) return;
    if (!pod.docs) pod.docs = [id];
    else pod.docs.push(id);
  });
  return dh;
}

export async function createTile (repo, tile) {
  const dh = repo.create({
    id: new am.RawString(tile.id || nanoid()),
    name: new am.RawString(tile.name || 'Tile Without A Name'),
    icons: [],
    resources: {},
    wishes: {},
  });
  await dh.whenReady();
  return dh;
}

async function asyncChange (dh, fn) {
  return new Promise((resolve, reject) => {
    dh.change((doc) => {
      try {
        fn(doc);
        resolve(doc);
      }
      catch (err) {
        reject(err);
      }
    });
  });
}
