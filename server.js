
import PolypodAPIServer from './lib/api-server.js';
import { PORT, INVITE_CODE, JWT_SECRET } from './shared/constants.js';
import makeRel from './shared/rel.js';

const rel = makeRel(import.meta.url);
const server = new PolypodAPIServer({
  dir: rel('data'), 
  port: PORT,
  inviteCode: INVITE_CODE,
  jwtSecret: JWT_SECRET,
});
await server.run(() => {
  console.warn(`Polypod server running at http://localhost:${PORT}`);
});
