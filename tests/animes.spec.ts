import request from 'supertest'

import server from '@src/server'

import database from '@database/index'
import { users } from '@database/users'
import { animes } from '@database/animes'

import { User } from '@models/user'
import { Anime } from '@models/anime'
import { AnimesView } from '@views/animes'

describe('Animes [v1]', () => {
  beforeAll(async () => {
    await database.sync(true)
    database.seed()
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
          synopsis: "Violet Evergarden (ヴァイオレット・エヴァーガーデン, Vaioretto Evāgāden) is the protagonist of the Violet Evergarden series. Violet is a former soldier who was enlisted in the Leidenschaftlich army and fought in the war, where she was treated as nothing more than a weapon. Violet became an Auto Memories Doll at the CH Postal Company after the war, seeking to understand the meaning of the words \"I love you\", which was said to her by her major Gilbert Bougainvillea, during the War's final battle.",
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
          synopsis: 'Gaiden consists of six stories in total: the first one revolves around Charlotte\'s story. Another story will be centered on Benedict who visits a certain town with Violet due to work and they lose track of one another. Another will feature Cattleya, who gets proposed to by one of her clients, and while his personality has nothing to be criticized as a marriage partner, a “certain person” keeps surfacing in Cattleya’s mind. Another one will be about Gilbert and Hodgins, who met for the first time in the military academy that they attended. Hodgins reminisces about how he and Gilbert became friends and the things they had done. The last story features all the CH Postal Company characters. The company shows a rapid growth due to being supported by the public as they are even able to deliver letters to and from the battlefields.',
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

  test('[PATCH /v1/users/:id] non-unique new fields', async () => {
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
