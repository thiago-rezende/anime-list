import { validateJwt } from '@utils/jwt'
import { Request, Response, NextFunction } from 'express'

import { AuthorizationError } from '@errors/auth'

import { User } from '@models/user'

const authMiddleware = function (req: Request, _res: Response, next: NextFunction) {
  if (req.path === '/auth') return next()

  if (!req.headers.authorization) {
    throw new AuthorizationError('unauthorized')
  }

  const accessToken = req.headers.authorization.split(' ')[1]

  const payload = validateJwt(accessToken)

  req.user = (payload.user as User)

  next()
}

export default authMiddleware
