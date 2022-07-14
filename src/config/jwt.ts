import { readFileSync } from 'fs';

import { Algorithm } from 'jsonwebtoken';

export interface JwtConfig {
  passphrase: string;
  privateKey: Buffer;
  publicKey: Buffer;
  algorithm: Algorithm;
  expiresIn: string;
}

const jwt: JwtConfig = {
  passphrase: process.env.PASSPHRASE || 'secret',
  privateKey: readFileSync('certs/jwtRS256.key'),
  publicKey: readFileSync('certs/jwtRS256.pem'),
  algorithm: 'RS256',
  expiresIn: '2h'
};

export default jwt;
