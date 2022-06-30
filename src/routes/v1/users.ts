import { Router, Request, Response, NextFunction } from 'express'

import { usersView, userView } from '@views/users'
import { User, UserDTO } from '@models/user'
import { InvalidCreateUserRequestBodyError, UserCreationError } from '@errors/user'
import { createUser, deleteUser } from '@controllers/users'

type CreateUserRequestBody = { user: UserDTO }
type DeletUserRequestParams = { id: string }

const users = Router()

users.get('/', async (_req: Request, res: Response) => {
  const users = await User.findAll()
  res.status(200).json(usersView(users, 1, 1))
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

users.delete('/:id', async (req: Request<DeletUserRequestParams>, res: Response, next: NextFunction) => {
  const result = await deleteUser(req.params.id)

  if (!result) { res.status(204).send() }

  next(result)
})

export default users
