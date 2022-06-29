import request from 'supertest'

import server from '@src/server'

import database from '@database/index'

import { createJwt } from '@utils/jwt'

describe('Users v1', () => {
  test('[GET /v1/users] unauthenticated', async () => {
    const res = await request(server).get('/v1/users')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /v1/users] authenticated', async () => {
    const user = database.users[0]

    const accessToken = createJwt(user)

    const res = await request(server)
      .get('/v1/users')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
  })
})
