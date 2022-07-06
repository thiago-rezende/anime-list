import database, { sequelize } from '@database/index'
import config from '@config/database'

import { DatabaseError } from 'sequelize'

(async () => {
  console.log(`[database] <seed> seeding '${config.database}' database`)

  sequelize.options.logging = console.log

  try {
    await database.seed()
  } catch (error) {
    if (error instanceof DatabaseError) console.log(`[database] <${error.name}> ${error.message}`)
  }

  await sequelize.close()
})()
