import express from 'express'

import authMiddleware from '@middlewares/auth'
import errorMiddleware from '@middlewares/error'

import router from './router'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(authMiddleware)

server.use('/', router)

server.use(errorMiddleware)

export default server
