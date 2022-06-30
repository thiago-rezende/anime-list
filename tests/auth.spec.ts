import request from 'supertest'

import server from '@src/server'

import database from '@database/index'
import { users } from '@database/users'

import { User } from '@models/user'

describe('Authentication', () => {
  beforeAll(async () => {
    await database.sync(true)
    database.seed()
  })

  test('[POST /auth] correct credentials', async () => {
    const user: User = users[0]

    const res = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('access_token')
  })

  test('[POST /auth] incorrect request body', async () => {
    let res = await request(server)
      .post('/auth')
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')

    res = await request(server)
      .post('/auth')
      .send({ user: {} })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')

    res = await request(server)
      .post('/auth')
      .send({ user: { email: 'jhon.doe@domain.com' } })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')

    res = await request(server)
      .post('/auth')
      .send({ user: { password: 'secret' } })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('[POST /auth] non-existent user', async () => {
    const res = await request(server)
      .post('/auth')
      .send({ user: { email: 'user@domain.com', password: 'password' } })

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  test('[POST /auth] incorrect credentials', async () => {
    const user: User = users[0]

    const res = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: 'wrong_password' } })

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /auth/me] unauthenticated', async () => {
    const res = await request(server).get('/auth/me')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('[GET /auth/me] authenticated', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('user')
  })
})
