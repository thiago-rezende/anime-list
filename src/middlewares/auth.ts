import { validateJwt } from '@utils/jwt'
import { Request, Response, NextFunction } from 'express'

const authMiddleware = function (req: Request, res: Response, next: NextFunction) {
  if (req.path === '/auth') return next()

  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'unauthorized' })
  }

  const token = req.headers.authorization.split(' ')[1]

  const payload = validateJwt(token)

  req.user = payload.user

  next()
}

export default authMiddleware
