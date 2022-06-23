import { Router, Request, Response } from 'express'

import users from '@routes/v1/users'

const v1 = Router()

v1.use('/users', users)

v1.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Anime List',
    version: 1,
    resources: [
      '/users'
    ]
  })
})

export default v1
