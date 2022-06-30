import { Router, Request, Response, NextFunction } from 'express'

import { userView } from '@views/users'

import { createJwt, getJwtPayload } from '@utils/jwt'

import { AuthorizationError, InvalidAuthRequestBodyError, InvalidCredentialsError } from '@errors/auth'
import { UserNotFoundError } from '@errors/user'
import { User } from '@models/user'

const auth = Router()

type AuthRequestBody = { user: { email: string, password: string } }

auth.post('/', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
  const reqUser = req.body.user

  const invalidAuthRequest = new InvalidAuthRequestBodyError('invalid auth request body', [])

  if (!reqUser) {
    invalidAuthRequest.fields.push({ field: 'user', description: 'should have an object \'user\'' })
    return next(invalidAuthRequest)
  }
  const email = reqUser.email
  const password = reqUser.password

  if (!email || !password) {
    if (!email) invalidAuthRequest.fields.push({ field: 'email', description: 'the user object should have an attribute \'email\'' })
    if (!password) invalidAuthRequest.fields.push({ field: 'password', description: 'the user object should have an attribute \'password\'' })

    return next(invalidAuthRequest)
  }

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
