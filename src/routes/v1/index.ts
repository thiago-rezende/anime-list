import { Router, Request, Response } from 'express'

const v1 = Router()

v1.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Anime List',
    version: 1
  })
})

export default v1
