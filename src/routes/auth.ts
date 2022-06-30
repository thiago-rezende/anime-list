import { Router, Request, Response, NextFunction } from 'express'

import { userView } from '@views/users'

import { createJwt, getJwtPayload } from '@utils/jwt'

import { AuthorizationError, InvalidCredentialsError } from '@errors/auth'
import { UserNotFoundError } from '@errors/user'
import { User } from '@src/models/user'

const auth = Router()

type AuthRequestBody = { user: { email: string, password: string } }

auth.post('/', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
  const email = req.body.user.email
  const password = req.body.user.password

  const user = await User.findOne({ where: { email } })

  if (!user) return next(new UserNotFoundError('user not found'))

  if (user.password !== password) return next(new InvalidCredentialsError('invalid credentials'))

  const accessToken = createJwt(user)

  res.set('Authorization', 'Bearer  ' + accessToken)

  return res.status(200).json({ access_token: accessToken })
})

auth.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (accessToken) {
    const payload = getJwtPayload(accessToken)

    const user = await User.findOne({ where: { id: payload.user.id } })

    if (!user) return next(new UserNotFoundError('user not found'))

    return res.status(200).json({ user: userView(user) })
  }

  next(new AuthorizationError('unauthorized'))
})

export default auth
