import express from 'express'

import config from './config/index'

import authMiddleware from '@middlewares/auth'
import errorMiddleware from '@middlewares/error'

import router from './router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authMiddleware)

app.use('/', router)

app.use(errorMiddleware)

app.listen(config.env.port, () => console.log(`[anime-list]: listening on port ${config.env.port}`))
