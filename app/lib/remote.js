
import axios from "axios";
import isProd from "../../shared/is-prod.js";
import { PORT } from "../../shared/constants.js";

export const client = axios.create({
  baseURL: isProd ? 'https://api.polypod.space' : `http://localhost:${PORT}`,
});
