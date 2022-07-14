import { createServer } from '~/server'
import config from '~/config'

import database from '~/database'

(async () => {
  await database.sync(false)
  await database.seed()
})()

const server = createServer()

server.listen(config.env.port, () => console.log(`[anime-list]: listening on port ${config.env.port}`))
