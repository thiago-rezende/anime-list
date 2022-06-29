import { Router, Request, Response } from 'express'

import { usersView } from '@views/users'
import { User } from '@src/models/user'

const users = Router()

users.get('/', async (_req: Request, res: Response) => {
  const users = await User.findAll()
  res.status(200).json(usersView(users, 1, 1))
})

export default users
