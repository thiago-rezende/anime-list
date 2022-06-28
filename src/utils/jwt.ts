import { User } from '@models/user'
import { userView } from '@views/users'
import { readFileSync } from 'fs'

import jwt, { JwtPayload } from 'jsonwebtoken'

const privateKey = readFileSync('certs/jwtRS256.key')
const publicKey = readFileSync('certs/jwtRS256.pem')

export function createJwt(user: User): string {
  const payload: JwtPayload = {
    user: userView(user)
  }

  const accessToken = jwt.sign(payload, { key: privateKey, passphrase: process.env.PASSPHRASE || 'secret' }, {
    algorithm: 'RS256',
    expiresIn: '2h'
  })

  return accessToken
}

export function validateJwt(accessToken: string): JwtPayload {
  return (jwt.verify(accessToken, publicKey) as JwtPayload)
}

export function getJwtPayload(accessToken: string): JwtPayload {
  const decoded: JwtPayload = (jwt.decode(accessToken) as JwtPayload)

  return { user: { username: decoded.user.username, email: decoded.user.email } }
}
