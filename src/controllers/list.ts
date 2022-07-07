import { User } from '@models/user'
import { AnimeList } from '@models/anime_list'

import { FindOptions } from 'sequelize'

export async function getAnimeList(user: User, options: FindOptions): Promise<{ rows: Array<AnimeList>, count: number }> {
  options.where = { ...options.where, userId: user.id }
  const list = await AnimeList.findAndCountAll(options)

  return list
}
