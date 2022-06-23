import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Anime List', version: '0.1.0' })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`[anime-list]: listening on port ${port}`))
