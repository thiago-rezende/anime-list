import { Router, Request, Response } from 'express'

import { Anime } from '@models/anime'

const animes = Router()

animes.get('/', async (_req: Request, res: Response) => {
  const animes = await Anime.findAll()

  res.status(200).json({ animes })
})

export default animes
