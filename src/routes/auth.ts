import { Router, Request, Response, NextFunction } from 'express'

import { userView } from '@views/users'

import { createJwt } from '@utils/jwt'

import { InvalidAuthRequestBodyError, InvalidCredentialsError } from '@errors/auth'

import { User } from '@models/user'

import { UserNotFoundError } from '@errors/user'

import { findUser } from '@controllers/users'

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

  const user = await findUser({ where: { email } })

  if (user instanceof UserNotFoundError) return next(user)

  if (user.password !== password) return next(new InvalidCredentialsError('invalid credentials'))

  const accessToken = createJwt(user)

  res.set('Authorization', 'Bearer  ' + accessToken)

  return res.status(200).json({ access_token: accessToken })
})

auth.get('/me', async (req: Request, res: Response) => {
  return res.status(200).json({ user: userView(req.user as User) })
})

export default auth
