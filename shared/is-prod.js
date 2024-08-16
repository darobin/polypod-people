
import { env } from 'node:process';

const isProd = env.NODE_ENV === 'production';
export default isProd;
