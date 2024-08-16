
import axios from "axios";
import isProd from "../../shared/is-prod.js";
import { PORT } from "../../shared/constants.js";

const client = axios.create({
  baseURL: isProd ? 'https://api.polypod.space' : `http://localhost:${PORT}`,
});

export async function personHasHandle (handle) {
  const res = await client.get(`/person/${handle}`);
  return res.status === 200;
}

export async function personSetup (handle, pubKey) {
  const res = await client.post(`/person/setup`, { handle, pubKey });
  return res.status === 201;
}
