import express, { Express } from 'express'

import authMiddleware from '@middlewares/auth'
import errorMiddleware from '@middlewares/error'

import router from './router'

export function createServer(): Express {
  const server = express()

  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  server.use(authMiddleware)

  server.use('/', router)

  server.use(errorMiddleware)

  return server
}
