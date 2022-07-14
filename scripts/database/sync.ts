import database, { sequelize } from '~/database/index'
import config from '~/config/database'

(async () => {
  console.log(`[database] <sync> synchronizing '${config.database}' database`)

  sequelize.options.logging = console.log

  await database.sync(true)

  await sequelize.close()
})()
