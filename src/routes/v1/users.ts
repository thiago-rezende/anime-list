import { Router, Request, Response, NextFunction } from 'express'

import { usersView } from '@views/users'
import { User } from '@src/models/user'

type CreateUserRequestBody = { user: { email: string, password: string } }

const users = Router()

users.get('/', async (_req: Request<{}, {}, CreateUserRequestBody>, res: Response) => {
  const users = await User.findAll()
  res.status(200).json(usersView(users, 1, 1))
})

users.post('/', async (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({})
})

export default users
