
import PolypodAPIServer from './lib/api-server.js';
import { PORT, INVITE_CODE } from './shared/constants.js';
import makeRel from './shared/rel.js';

const rel = makeRel(import.meta.url);
const server = new PolypodAPIServer({
  dir: rel('data'), 
  port: PORT,
  inviteCode: INVITE_CODE,
});
await server.run();
