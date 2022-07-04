import { Router, Request, Response } from 'express'

import { FindOptions } from 'sequelize/types'

import { getPaginationInfo } from '@utils/pagination'

import { Anime } from '@models/anime'
import { listAnimes } from '@controllers/animes'
import { animesView } from '@views/animes'

const animes = Router()

type ListAnimesRequestQuery = { page?: string, size?: string }

animes.get('/', async (req: Request<{}, {}, {}, ListAnimesRequestQuery>, res: Response) => {
  const page = req.query.page
  const size = req.query.size

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))
  const options: FindOptions = { limit: paginationInfo.limit, offset: paginationInfo.offset }

  const users = await listAnimes(options)

  res.status(200).json(animesView(users, paginationInfo))
})

export default animes
