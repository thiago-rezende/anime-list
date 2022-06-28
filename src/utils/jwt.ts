import config from '@config/index'

import { User } from '@models/user'
import { userView } from '@views/users'

import jwt, { JwtPayload } from 'jsonwebtoken'

export function createJwt(user: User): string {
  const payload: JwtPayload = {
    user: userView(user)
  }

  const accessToken = jwt.sign(payload, { key: config.jwt.privateKey, passphrase: config.jwt.passphrase }, {
    algorithm: config.jwt.algorithm,
    expiresIn: config.jwt.expiresIn
  })

  return accessToken
}

export function validateJwt(accessToken: string): JwtPayload {
  return (jwt.verify(accessToken, config.jwt.publicKey) as JwtPayload)
}

export function getJwtPayload(accessToken: string): JwtPayload {
  const decoded: JwtPayload = (jwt.decode(accessToken) as JwtPayload)

  return { user: decoded.user }
}
