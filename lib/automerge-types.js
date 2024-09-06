
import { next as am } from "@automerge/automerge";

export async function createPerson (repo, p) {
  const dh = repo.create({
    name: new am.RawString(p.name || 'Anonymous Friend'),
    username: new am.RawString(p.username || ''),
  });
  await dh.whenReady();
  return dh;
}
