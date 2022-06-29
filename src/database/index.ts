import config from '@config/database'

import { seed as seedUsers } from '@database/users'

import { Sequelize } from 'sequelize-typescript'

import { User } from '@models/user'

const sequelize = new Sequelize({
  ...config,
  models: [User]
})

interface Database {
  seed: () => void
  sync: (foce: boolean) => void
}

const database: Database = {
  seed: () => {
    seedUsers()
  },
  sync: async (force: boolean) => {
    await sequelize.sync({ force })
    sequelize.addModels([User])
  }
}

export default database

export { Sequelize, sequelize }
