
import { createPod as automergeCreatePod } from "../../shared/automerge-types.js";
import { repo } from "../lib/automerge.js";
import { $loggedIn } from "./identity.js";

export async function createPod (name) {
  const ph = repo.find($loggedIn.get());
  automergeCreatePod(repo, { name }, ph);
}
