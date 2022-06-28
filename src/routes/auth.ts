import { Router, Request, Response } from 'express'

import { userView } from '@views/users'

import database from '@database/index'

import { createJwt, getJwtPayload } from '@utils/jwt'

import { AuthorizationError, InvalidCredentialsError } from '@errors/auth'
import { UserNotFoundError } from '@errors/user'

const auth = Router()

type AuthRequestBody = { user: { email: string, password: string } }

auth.post('/', (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  const email = req.body.user.email
  const password = req.body.user.password

  const user = database.users.find((user) => {
    return user.email === email && user.password === password
  })

  if (!user) throw new InvalidCredentialsError('invalid credentials')

  const accessToken = createJwt(user)

  res.set('Authorization', 'Bearer  ' + accessToken)

  return res.status(200).json({ access_token: accessToken })
})

auth.get('/me', (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (accessToken) {
    const payload = getJwtPayload(accessToken)

    const user = database.users.find((user) => {
      return user.username === payload.user.username && user.email === payload.user.email
    })

    if (!user) throw new UserNotFoundError('user not found')

    return res.status(200).json({ user: userView(user) })
  }

  throw new AuthorizationError('unauthorized')
})

export default auth
