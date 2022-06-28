import { Router, Request, Response } from 'express'

import { userView } from '@views/users'

import database from '@database/index'

import { createJwt, getJwtPayload } from '@utils/jwt'

const auth = Router()

type AuthRequestBody = { user: { email: string, password: string } }

auth.post('/', (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  const email = req.body.user.email
  const password = req.body.user.password

  const user = database.users.find((user) => {
    return user.email === email && user.password === password
  })

  if (user === undefined) { return res.status(401).json({ message: 'invalid credentials' }) }

  const token = createJwt(user)

  res.set('Authorization', token)

  return res.status(200).json({ token })
})

auth.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (token) {
    const payload = getJwtPayload(token)

    const user = database.users.find((user) => {
      return user.username === payload.user.username && user.email === payload.user.email
    })

    if (!user) return res.status(404).json({ message: 'user not found' })

    return res.status(200).json({ user: userView(user) })
  }

  return res.status(401).json({ message: 'unauthorized' })
})

export default auth
