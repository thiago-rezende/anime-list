import request from 'supertest'

import server from '@src/server'

import database from '@database/index'
import { users } from '@database/users'

import { User } from '@models/user'
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
})
