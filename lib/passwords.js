
import bcrypt from 'bcrypt';

export async function hashPassword (pwd) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, 12, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}

export async function checkPassword (pwd, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, hash, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
