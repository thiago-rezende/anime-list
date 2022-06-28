import { User } from '@models/user'
import { userView } from '@views/users'
import { readFileSync } from 'fs'

import jwt, { JwtPayload } from 'jsonwebtoken'

const privateKey = readFileSync('certs/jwtRS256.key')
const publicKey = readFileSync('certs/jwtRS256.pem')

export function createJwt(user: User): string {
  const token = jwt.sign({
    user: userView(user)
  }, { key: privateKey, passphrase: process.env.PASSPHRASE || 'secret' }, {
    algorithm: 'RS256',
    expiresIn: '2h'
  })

  return token
}

export function validateJwt(token: string): JwtPayload {
  return (jwt.verify(token, publicKey) as JwtPayload)
}

export function getJwtPayload(token: string): JwtPayload {
  const decoded: JwtPayload = (jwt.decode(token) as JwtPayload)

  return { user: { username: decoded.user.username, email: decoded.user.email } }
}
