import express from 'express'
import authMiddleware from './middlewares/auth'

import router from './router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authMiddleware)

app.use('/', router)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[anime-list]: listening on port ${port}`))
