import { createServer } from '@src/server'
import config from '@config/index'

import database from '@database/index'

(async () => {
  await database.sync(false)
  await database.seed()
})()

const server = createServer()

server.listen(config.env.port, () => console.log(`[anime-list]: listening on port ${config.env.port}`))
