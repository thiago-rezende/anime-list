import { Router, Request, Response } from 'express'

import database from '@database/index'

const users = Router()

users.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    users: database.users
  })
})

export default users
