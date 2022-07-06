import { start } from '@src/server'
import config from '@config/index'

import database from '@database/index'

(async () => {
  await database.sync(true)
  await database.seed()
})()

start(config.env.port, () => console.log(`[anime-list]: listening on port ${config.env.port}`))
