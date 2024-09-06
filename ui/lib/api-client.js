
import axios from 'axios';

export const client = axios.create({
  baseURL: `${window.polypod.server}/api/`,
  validateStatus: () => true,
});
