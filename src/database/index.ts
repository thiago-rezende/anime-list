import config from '@config/database'

import { seed as seedUsers } from '@database/users'
import { seed as seedAnimes } from '@database/animes'
import { seed as seedAnimeList } from '@database/anime_list'

import { Sequelize } from 'sequelize-typescript'

import { User } from '@models/user'
import { Anime } from '@models/anime'
import { AnimeList } from '@models/anime_list'

const sequelize = new Sequelize({
  ...config,
  models: [User, Anime, AnimeList]
})

interface Database {
  seed: () => Promise<void>
  sync: (foce: boolean) => Promise<void>,
  close: () => Promise<void>
}

const database: Database = {
  seed: async () => {
    await seedUsers()
    await seedAnimes()
    await seedAnimeList()
  },
  sync: async (force: boolean) => {
    await sequelize.sync({ force })
    sequelize.addModels([User, Anime, AnimeList])
  },
  close: async () => {
    await sequelize.close()
  }
}

export default database

export { Sequelize, sequelize }
