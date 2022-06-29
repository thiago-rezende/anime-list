import { Router, Request, Response } from 'express'

import { userView } from '@views/users'

import { createJwt, getJwtPayload } from '@utils/jwt'

import { AuthorizationError, InvalidCredentialsError } from '@errors/auth'
import { UserNotFoundError } from '@errors/user'
import { User } from '@src/models/user'

const auth = Router()

type AuthRequestBody = { user: { email: string, password: string } }

auth.post('/', async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  const email = req.body.user.email
  const password = req.body.user.password

  const user = await User.findOne({ where: { email } })

  /**
   * TODO: move error handling to error middleware
   */
  if (!user) {
    const err = new UserNotFoundError('user not found')
    return res.status(404).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  /**
   * TODO: move error handling to error middleware
   */
  if (user.password !== password) {
    const err = new InvalidCredentialsError('invalid credentials')
    return res.status(401).json({
      error: {
        message: err.message,
        name: err.name
      }
    })
  }

  const accessToken = createJwt(user)

  res.set('Authorization', 'Bearer  ' + accessToken)

  return res.status(200).json({ access_token: accessToken })
})

auth.get('/me', async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (accessToken) {
    const payload = getJwtPayload(accessToken)

    const user = await User.findOne({ where: { id: payload.user.id } })

    if (!user) throw new UserNotFoundError('user not found')

    return res.status(200).json({ user: userView(user) })
  }

  throw new AuthorizationError('unauthorized')
})

export default auth
