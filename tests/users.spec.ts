import request from 'supertest'

import server from '@src/server'

import database from '@database/index'
import { users } from '@database/users'

import { User } from '@models/user'
import { UsersView } from '@views/users'

describe('Users [v1]', () => {
  beforeAll(async () => {
    await database.sync(true)
    database.seed()
  })

  test('[GET /v1/users] unauthenticated', async () => {
    const res = await request(server).get('/v1/users')

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
  })

  test('[GET /v1/users] authenticated', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .get('/v1/users')
      .query({ page: 1, size: 1 })
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
    expect(res.body).toHaveProperty('page')
    expect(res.body).toHaveProperty('pageSize')
    expect(res.body).toHaveProperty('totalPages')
    expect(res.body).toHaveProperty('totalItems')

    expect((res.body as UsersView).users.length).toBe(1)
    expect((res.body as UsersView).page).toBe(1)
    expect((res.body as UsersView).pageSize).toBe(1)
    expect((res.body as UsersView).totalPages).toBe(2)
    expect((res.body as UsersView).totalItems).toBe(2)
  })

  test('[POST /v1/users] correct request body', async () => {
    const user: User = users[0]

    const res = await request(server)
      .post('/v1/users')
      .send({ user: { email: user.email, username: user.username, password: user.password } })

    expect(res.statusCode).toBe(409)
    expect(res.body).toHaveProperty('error')
  })

  test('[POST /v1/users] non-existing user', async () => {
    const res = await request(server)
      .post('/v1/users')
      .send({ user: { email: 'jhon.doe@domain.com', username: 'jhon.doe', password: 'secret' } })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('user')
  })

  test('[POST /v1/users] incorrect request body', async () => {
    let res = await request(server)
      .post('/v1/users')
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')

    res = await request(server)
      .post('/v1/users')
      .send({ user: {} })

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('[PATCH /v1/users/:id] incorrect request body', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .patch(`/v1/users/${user.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('[PATCH /v1/users/:id] unique new fields', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    let res = await request(server)
      .patch(`/v1/users/${user.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ user: { email: 'jane.doe@domain.com', username: 'jane.doe', password: 'secret' } })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('user')

    res = await request(server)
      .patch(`/v1/users/${user.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ user: { email: user.previous('email'), username: user.previous('username'), password: user.previous('password') } })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('user')
  })

  test('[PATCH /v1/users/:id] non-unique new fields', async () => {
    const user: User = users[0]
    const otherUser: User = users[1]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .patch(`/v1/users/${user.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ user: { email: otherUser.email, username: otherUser.username, password: otherUser.password } })

    expect(res.statusCode).toBe(409)
    expect(res.body).toHaveProperty('error')
  })

  test('[DELETE /v1/users/:id] existing user', async () => {
    const user: User = users[0]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .delete(`/v1/users/${user.id}`)
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(204)
  })

  test('[DELETE /v1/users/:id] non-existing user', async () => {
    const user: User = users[1]

    const auth = await request(server)
      .post('/auth')
      .send({ user: { email: user.email, password: user.password } })

    const accessToken = auth.body.access_token

    const res = await request(server)
      .delete('/v1/users/non-existing-id')
      .set('Authorization', 'Bearer ' + accessToken)

    expect(res.statusCode).toBe(404)
  })
})
