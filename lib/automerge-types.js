
import * as am from "@automerge/automerge/next";

export async function createPerson (repo, p) {
  const dh = repo.create({
    name: new am.RawString(p.name || 'Anonymous Friend'),
  });
  await dh.whenReady();
  return dh;
}
