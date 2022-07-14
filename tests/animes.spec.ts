import request from 'supertest'

import { createServer } from '~/server'

import database from '~/database/index'
import { users } from '~/database/users'
import { animes } from '~/database/animes'

import { User } from '~/models/user'
import { Anime } from '~/models/anime'
import { AnimesView } from '~/views/animes'

const server = createServer()

describe('Animes [v1]', () => {
  beforeAll(async () => {
    await database.sync(true)
    await database.seed()
  })

  afterAll(async () => {
    await database.close()
  })

  test('[GET /v1/animes] unauthenticated', async () => {
    const res = await request(server).get('/v1/animes')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /v1/animes] authenticated', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/v1/animes')
      .query({ page: 1, size: 1 })
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('animes')
    expect(res.body).toHaveProperty('page')
    expect(res.body).toHaveProperty('pageSize')
    expect(res.body).toHaveProperty('totalPages')
    expect(res.body).toHaveProperty('totalItems')

    expect((res.body as AnimesView).animes.length).toBe(1)
    expect((res.body as AnimesView).page).toBe(1)
    expect((res.body as AnimesView).pageSize).toBe(1)
    expect((res.body as AnimesView).totalPages).toBe(2)
    expect((res.body as AnimesView).totalItems).toBe(2)
  })

  test('[GET /v1/animes/:slug] non-existing anime', async () => {
    const user: User = users[0]
    const anime = { slug: 'violet-evergarden' }

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get(`/v1/animes/${anime.slug}`)
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(404)
  })

  test('[GET /v1/animes/:slug] existing anime', async () => {
    const user: User = users[0]
    const anime: Anime = animes[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get(`/v1/animes/${anime.slug}`)
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('anime')
  })

  test('[POST /v1/animes] correct request body', async () => {
    const anime: Anime = animes[0]

    const res = await request(server)
      .post('/v1/animes')
      .send({
        anime: {
          name: anime.name,
          slug: anime.slug,
          native: anime.native,
          romaji: anime.romaji,
          synopsis: anime.synopsis,
          releaseDate: anime.releaseDate
        }
      })

    expect(res.statusCode).toBe(409)
    expect(res.body).toHaveProperty('error')
  })

  test('[POST /v1/animes] non-existing anime', async () => {
    const res = await request(server)
      .post('/v1/animes')
      .send({
        anime: {
          name: 'Violet Evergarden',
          slug: 'violet-evergarden',
          native: 'ヴァイオレット・エヴァーガーデン',
          romaji: 'Vaioretto Evāgāden',
          synopsis: "A certain point in time, in the continent of Telesis. The great war which divided the continent into North and South has ended after four years, and the people are welcoming a new generation. Violet Evergarden, a young girl formerly known as “the weapon”, has left the battlefield to start a new life at CH Postal Service. There, she is deeply moved by the work of “Auto Memories Dolls”, who carry people's thoughts and convert them into words. Violet begins her journey as an Auto Memories Doll, and comes face to face with various people's emotions and differing shapes of love. There are words Violet heard on the battlefield, which she cannot forget. These words were given to her by someone she holds dear, more than anyone else. She does not yet know their meaning but she searches to find it.",
          releaseDate: '2018-01-11T00:00:00.000Z'
        }
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('anime')
  })

  test('[POST /v1/animes] incorrect request body', async () => {
    let res = await request(server)
      .post('/v1/animes')
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')

    res = await request(server)
      .post('/v1/animes')
      .send({ anime: {} })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('[PATCH /v1/animes/:id] incorrect request body', async () => {
    const user: User = users[0]
    const anime: Anime = animes[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .patch(`/v1/animes/${anime.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('[PATCH /v1/animes/:id] unique new fields', async () => {
    const user: User = users[0]
    const anime: Anime = animes[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    let res = await request(server)
      .patch(`/v1/animes/${anime.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        anime: {
          name: 'Violet Evergarden Gaiden',
          slug: 'violet-evergarden-gaiden',
          native: 'ヴァイオレット・エヴァーガーデン 外伝',
          romaji: 'Vaioretto Evāgāden Gaiden',
          synopsis: 'Violet Evergarden comes to a private women\'s academy to tutor Isabella in the ways of being a lady. Heir to the York family, Isabella feels trapped in this new and uncomfortable world. She still grieves for the only person to ever bring her happiness – now lost to her. Violet\'s lessons do give her a brief respite from the melancholy but with the absence of joy, how long does it take to truly heal?',
          releaseDate: '2019-03-18T00:00:00.000Z'
        }
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('anime')

    res = await request(server)
      .patch(`/v1/animes/${anime.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        anime: {
          name: anime.previous('name'),
          slug: anime.previous('slug'),
          native: anime.previous('native'),
          romaji: anime.previous('romaji'),
          synopsis: anime.previous('synopsis'),
          releaseDate: anime.previous('releaseDate')
        }
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('anime')
  })

  test('[PATCH /v1/animes/:id] non-unique new fields', async () => {
    const user: User = users[0]
    const anime: Anime = animes[0]
    const otherAnime: Anime = animes[1]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .patch(`/v1/animes/${anime.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        anime: {
          name: otherAnime.name,
          slug: otherAnime.slug,
          native: otherAnime.native,
          romaji: otherAnime.romaji,
          synopsis: otherAnime.synopsis,
          releaseDate: otherAnime.releaseDate
        }
      })

    expect(res.statusCode).toBe(409)
    expect(res.body).toHaveProperty('error')
  })

  test('[DELETE /v1/animes/:id] existing anime', async () => {
    const user: User = users[0]
    const anime: Anime = animes[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .delete(`/v1/animes/${anime.id}`)
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(204)
  })

  test('[DELETE /v1/anime/:id] non-existing anime', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .delete('/v1/animes/non-existing-id')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(404)
  })
})
