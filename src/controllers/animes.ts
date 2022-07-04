import { Anime, AnimeDTO } from '@models/anime'
import { AnimeCreationError, AnimeNotFoundError, AnimeUpdateError } from '@errors/anime'

import { FindOptions, ValidationError } from 'sequelize/types'

export async function getAnime(id: string): Promise<Anime | AnimeNotFoundError> {
  const anime = await Anime.findByPk(id)

  if (!anime) return new AnimeNotFoundError('anime not found')

  return anime
}

export async function findAnime(options: FindOptions): Promise<Anime | AnimeNotFoundError> {
  const anime = await Anime.findOne(options)

  if (!anime) return new AnimeNotFoundError('anime not found')

  return anime
}

export async function listAnimes(options?: FindOptions): Promise<{ rows: Array<Anime>, count: number }> {
  const animes = await Anime.findAndCountAll(options)

  return animes
}

export async function createAnime(data: AnimeDTO): Promise<Anime | AnimeCreationError> {
  const anime = Anime.build({ ...data })

  try {
    await anime.save()
  } catch (err) {
    const animeCreationError = new AnimeCreationError('failed on user creation', [])

    const validationError = (err as ValidationError)

    validationError.errors.forEach(error => {
      animeCreationError.fields.push({ field: error.path as string, description: error.message })
    })

    return animeCreationError
  }

  return anime
}

export async function deleteAnime(id: string): Promise<AnimeNotFoundError | void> {
  const anime = await Anime.findByPk(id)

  if (!anime) return new AnimeNotFoundError('anime not found')

  await anime.destroy()
}

export async function updateAnime(id: string, data: AnimeDTO): Promise<AnimeNotFoundError | Anime> {
  const anime = await Anime.findByPk(id)

  if (!anime) return new AnimeNotFoundError('anime not found')

  const name = data.name
  const synopsis = data.synopsis
  const releaseDate = data.releaseDate

  if (name) anime.name = name
  if (synopsis) anime.synopsis = synopsis
  if (releaseDate) anime.releaseDate = releaseDate

  try {
    await anime.save()
  } catch (err) {
    const animeUpdateError = new AnimeUpdateError('failed on anime creation', [])

    const validationError = (err as ValidationError)

    validationError.errors.forEach(error => {
      animeUpdateError.fields.push({ field: error.path as string, description: error.message })
    })

    return animeUpdateError
  }

  return anime
}
