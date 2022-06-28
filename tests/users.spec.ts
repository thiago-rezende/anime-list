import request from 'supertest'

import server from '@src/server'

import database from '@database/index'

describe('Users v1', () => {
  test('[GET /v1/users] unauthenticated', async () => {
    const res = await request(server).get('/v1/users')

    expect(res.statusCode).toBe(401)
  })

  test('[GET /v1/users] authenticated', async () => {
    const user = database.users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/v1/users')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
  })
})
