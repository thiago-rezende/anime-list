import config from '@config/database'

import { seed as seedUsers } from '@database/users'
import { seed as seedAnimes } from '@database/animes'

import { Sequelize } from 'sequelize-typescript'

import { User } from '@models/user'
import { Anime } from '@models/anime'

const sequelize = new Sequelize({
  ...config,
  models: [User, Anime]
})

interface Database {
  seed: () => void
  sync: (foce: boolean) => void
}

const database: Database = {
  seed: () => {
    seedUsers()
    seedAnimes()
  },
  sync: async (force: boolean) => {
    await sequelize.sync({ force })
    sequelize.addModels([User, Anime])
  }
}

export default database

export { Sequelize, sequelize }
