import express from 'express'

import authMiddleware from '@middlewares/auth'
import errorMiddleware from '@middlewares/error'

import router from './router'

const server = express()

function start(port: number | string, cb: () => void) {
  server.listen(port, cb)
}

export default (() => {
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  server.use(authMiddleware)

  server.use('/', router)

  server.use(errorMiddleware)

  return server
})()

export { start }
