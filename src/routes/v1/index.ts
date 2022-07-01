import { Router, Request, Response } from 'express'

import users from '@routes/v1/users'
import animes from '@routes/v1/animes'

const v1 = Router()

v1.use('/users', users)
v1.use('/animes', animes)

v1.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Anime List',
    version: 1,
    resources: [
      '/users',
      '/animes'
    ]
  })
})

export default v1
