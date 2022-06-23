import express from 'express'

import router from './router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[anime-list]: listening on port ${port}`))
