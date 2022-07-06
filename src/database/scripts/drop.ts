import { sequelize } from '@database/index'
import config from '@config/database'

(async () => {
  console.log(`[database] <drop> dropping '${config.database}' database`)

  sequelize.options.logging = console.log

  await sequelize.getQueryInterface().dropDatabase(config.database as string)

  await sequelize.close()
})()
