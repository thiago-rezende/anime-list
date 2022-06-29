import request from 'supertest'

import server from '@src/server'

import database from '@database/index'
import { users } from '@database/users'

import { User } from '@models/user'

describe('Users [v1]', () => {
  beforeAll(async () => {
    await database.sync(true)
    database.seed()
  })

  test('[GET /v1/users] unauthenticated', async () => {
    const res = await request(server).get('/v1/users')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /v1/users] authenticated', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/v1/users')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
  })
})
