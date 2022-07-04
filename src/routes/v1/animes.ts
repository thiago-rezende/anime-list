import { Router, Request, Response, NextFunction } from 'express'

import { FindOptions, Op, WhereOptions } from 'sequelize'

import { getPaginationInfo } from '@utils/pagination'

import { Anime, AnimeDTO } from '@models/anime'
import { createAnime, deleteAnime, getAnimeBySlug, listAnimes, updateAnime } from '@controllers/animes'
import { animesView, animeView } from '@views/animes'

import { AnimeCreationError, InvalidAnimeRequestBodyError } from '@errors/anime'

const animes = Router()

type ListAnimesRequestQuery = { page?: string, size?: string, name?: string, native?: string, romaji?: string }

type CreateAnimeRequestBody = { anime: AnimeDTO }
type DeleteAnimeRequestParams = { id: string }

type GetAnimeRequestParms = { slug: string }

type UpdateAnimeRequestBody = { anime: AnimeDTO }
type UpdateAnimeRequestParams = { id: string }

animes.get('/', async (req: Request<{}, {}, {}, ListAnimesRequestQuery>, res: Response) => {
  const page = req.query.page
  const size = req.query.size
  const name = req.query.name
  const native = req.query.native
  const romaji = req.query.romaji

  const where: WhereOptions = {}

  if (name) where.name = { [Op.like]: '%' + name + '%' }
  if (native) where.native = { [Op.like]: '%' + native + '%' }
  if (romaji) where.romaji = { [Op.like]: '%' + romaji + '%' }

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))
  const options: FindOptions = { where, limit: paginationInfo.limit, offset: paginationInfo.offset }

  const animes = await listAnimes(options)

  res.status(200).json(animesView(animes, paginationInfo))
})

animes.get('/:slug', async (req: Request<GetAnimeRequestParms>, res: Response, next: NextFunction) => {
  const slug = req.params.slug

  const anime = await getAnimeBySlug(slug)

  if (!(anime instanceof Anime)) return next(anime)

  res.status(200).json({ anime: animeView(anime) })
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

  if (!(anime instanceof Anime)) return next(anime as AnimeCreationError)

  res.status(201).json({ anime: animeView(anime) })
})

animes.delete('/:id', async (req: Request<DeleteAnimeRequestParams>, res: Response, next: NextFunction) => {
  const result = await deleteAnime(req.params.id)

  if (!result) { return res.status(204).send() }

  return next(result)
})

animes.patch('/:id', async (req: Request<UpdateAnimeRequestParams, {}, UpdateAnimeRequestBody>, res: Response, next: NextFunction) => {
  const reqAnime = req.body.anime

  const invalidUpdateAnimeRequestBody = new InvalidAnimeRequestBodyError('invalid update anime request body', [])

  if (!reqAnime) {
    invalidUpdateAnimeRequestBody.fields.push({ field: 'anime', description: 'should have an object \'anime\'' })
    return next(invalidUpdateAnimeRequestBody)
  }

  const anime = await updateAnime(req.params.id, reqAnime)

  if (!(anime instanceof Anime)) return next(anime)

  res.status(200).send({ anime: animeView(anime) })
})

export default animes
