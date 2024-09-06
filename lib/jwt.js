
import jwt from 'jsonwebtoken';

export async function issueJWT (payload, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: '7d' }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}

export async function verifyJWT (token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}
