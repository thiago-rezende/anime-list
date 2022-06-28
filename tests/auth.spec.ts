import request from 'supertest'

import server from '@src/server'

import database from '@database/index'

describe('Authentication', () => {
  test('[POST /auth] correct credentials', async () => {
    const user = database.users[0]

    const res = await request(server)
      .post('/auth')
      .send({ user })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('access_token')
  })

  test('[POST /auth] incorrect credentials', async () => {
    const res = await request(server)
      .post('/auth')
      .send({ user: { email: 'wrong.email@domain.com', password: 'wrong_password' } })

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /auth/me] unauthenticated', async () => {
    const res = await request(server).get('/auth/me')

    expect(res.statusCode).toBe(401)
  })

  test('[GET /auth/me] authenticated', async () => {
    const user = database.users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('user')
  })
})
