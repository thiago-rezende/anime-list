import { Router, Request, Response, NextFunction } from 'express'

import { usersView, userView } from '@views/users'
import { User, UserDTO } from '@models/user'
import { InvalidCreateUserRequestBodyError, UserCreationError } from '@errors/user'
import { createUser, deleteUser, listUsers, updateUser } from '@controllers/users'
import { FindOptions } from 'sequelize/types'
import { getPaginationInfo } from '@utils/pagination'

type CreateUserRequestBody = { user: UserDTO }

type DeleteUserRequestParams = { id: string }

type UpdateUserRequestBody = { user: UserDTO }
type UpdateUserRequestParams = { id: string }

const users = Router()

type ListUsersRequestQuery = { page?: string, size?: string }

users.get('/', async (req: Request<{}, {}, {}, ListUsersRequestQuery>, res: Response) => {
  const page = req.query.page
  const size = req.query.size

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))
  const options: FindOptions = { limit: paginationInfo.limit, offset: paginationInfo.offset }

  const users = await listUsers(options)

  res.status(200).json(usersView(users, paginationInfo))
})

users.post('/', async (req: Request<{}, {}, CreateUserRequestBody>, res: Response, next: NextFunction) => {
  const reqUser = req.body.user

  const invalidCreateUserRequest = new InvalidCreateUserRequestBodyError('invalid create user request body', [])

  if (!reqUser) {
    invalidCreateUserRequest.fields.push({ field: 'user', description: 'should have an object \'user\'' })
    return next(invalidCreateUserRequest)
  }

  const email = reqUser.email
  const username = reqUser.username
  const password = reqUser.password

  if (!email || !password || !username) {
    if (!email) invalidCreateUserRequest.fields.push({ field: 'email', description: 'the user object should have an attribute \'email\'' })
    if (!username) invalidCreateUserRequest.fields.push({ field: 'username', description: 'the user object should have an attribute \'username\'' })
    if (!password) invalidCreateUserRequest.fields.push({ field: 'password', description: 'the user object should have an attribute \'password\'' })

    return next(invalidCreateUserRequest)
  }

  const user = await createUser(reqUser)

  if (user instanceof User) return res.status(201).json({ user: userView(user) })

  next(user as UserCreationError)
})

users.delete('/:id', async (req: Request<DeleteUserRequestParams>, res: Response, next: NextFunction) => {
  const result = await deleteUser(req.params.id)

  if (!result) { return res.status(204).send() }

  return next(result)
})

users.patch('/:id', async (req: Request<UpdateUserRequestParams, {}, UpdateUserRequestBody>, res: Response, next: NextFunction) => {
  const reqUser = req.body.user

  const invalidCreateUserRequest = new InvalidCreateUserRequestBodyError('invalid create user request body', [])

  if (!reqUser) {
    invalidCreateUserRequest.fields.push({ field: 'user', description: 'should have an object \'user\'' })
    return next(invalidCreateUserRequest)
  }

  const user = await updateUser(req.params.id, reqUser)

  if (user instanceof User) { return res.status(200).send({ user: userView(user) }) }

  next(user)
})

export default users
