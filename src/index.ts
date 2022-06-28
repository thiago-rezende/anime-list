import server from '@src/server'
import config from '@config/index'

server.listen(config.env.port, () => console.log(`[anime-list]: listening on port ${config.env.port}`))
