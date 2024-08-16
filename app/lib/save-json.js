
import { writeFile } from 'fs/promises';

export default async function saveJSON (url, data) {
  return await writeFile(url, JSON.stringify(data, null, 2));
}
