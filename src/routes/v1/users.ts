import { Router, Request, Response } from 'express'

import database from '@database/index'
import { usersView } from '@views/users'

const users = Router()

users.get('/', (_req: Request, res: Response) => {
  res.status(200).json(usersView(database.users, 1, 1))
})

export default users
