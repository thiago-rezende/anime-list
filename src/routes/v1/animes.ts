import { Router, Request, Response, NextFunction } from 'express'

import { FindOptions } from 'sequelize/types'

import { getPaginationInfo } from '@utils/pagination'

import { Anime, AnimeDTO } from '@models/anime'
import { createAnime, listAnimes } from '@controllers/animes'
import { animesView, animeView } from '@views/animes'

import { AnimeCreationError, InvalidAnimeRequestBodyError } from '@errors/anime'

const animes = Router()

type ListAnimesRequestQuery = { page?: string, size?: string }
type CreateAnimeRequestBody = { anime: AnimeDTO }

animes.get('/', async (req: Request<{}, {}, {}, ListAnimesRequestQuery>, res: Response) => {
  const page = req.query.page
  const size = req.query.size

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))
  const options: FindOptions = { limit: paginationInfo.limit, offset: paginationInfo.offset }

  const animes = await listAnimes(options)

  res.status(200).json(animesView(animes, paginationInfo))
})

animes.post('/', async (req: Request<{}, {}, CreateAnimeRequestBody>, res: Response, next: NextFunction) => {
  const reqAnime = req.body.anime

  const invalidCreateAnimeRequest = new InvalidAnimeRequestBodyError('invalid create anime request body', [])

  if (!reqAnime) {
    invalidCreateAnimeRequest.fields.push({ field: 'anime', description: 'should have an object \'anime\'' })
    return next(invalidCreateAnimeRequest)
  }

  const name = reqAnime.name
  const slug = reqAnime.slug
  const native = reqAnime.native
  const romaji = reqAnime.romaji
  const synopsis = reqAnime.synopsis
  const releaseDate = reqAnime.releaseDate

  if (!name || !slug || !native || !romaji || !synopsis || !releaseDate) {
    if (!name) invalidCreateAnimeRequest.fields.push({ field: 'name', description: 'the anime object should have an attribute \'name\'' })
    if (!slug) invalidCreateAnimeRequest.fields.push({ field: 'slug', description: 'the anime object should have an attribute \'slug\'' })
    if (!native) invalidCreateAnimeRequest.fields.push({ field: 'native', description: 'the anime object should have an attribute \'native\'' })
    if (!romaji) invalidCreateAnimeRequest.fields.push({ field: 'romaji', description: 'the anime object should have an attribute \'romaji\'' })
    if (!synopsis) invalidCreateAnimeRequest.fields.push({ field: 'synopsis', description: 'the anime object should have an attribute \'synopsis\'' })
    if (!releaseDate) invalidCreateAnimeRequest.fields.push({ field: 'releaseDate', description: 'the anime object should have an attribute \'releaseDate\'' })

    return next(invalidCreateAnimeRequest)
  }

  const anime = await createAnime(reqAnime)

  if (anime instanceof Anime) return res.status(201).json({ anime: animeView(anime) })

  next(anime as AnimeCreationError)
})

export default animes
