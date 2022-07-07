import { Router, Request, Response, NextFunction } from 'express'

import { usersView, userView } from '@views/users'
import { User, UserDTO } from '@models/user'
import { Anime } from '@models/anime'
import { InvalidUserRequestBodyError, UserCreationError } from '@errors/user'
import { createUser, deleteUser, listUsers, updateUser, getUserByUsername } from '@controllers/users'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { getPaginationInfo } from '@utils/pagination'
import { animeListView } from '@views/list'
import { getAnimeList } from '@controllers/list'

const users = Router()

type ListUsersRequestQuery = { page?: string, size?: string, email?: string, username?: string }
type ListAnimesRequestQuery = { page?: string, size?: string, name?: string, slug?: string, native?: string, romaji?: string }

type GetUserRequestParams = { username: string }

type CreateUserRequestBody = { user: UserDTO }

type UpdateUserRequestBody = { user: UserDTO }
type UpdateUserRequestParams = { id: string }

type DeleteUserRequestParams = { id: string }

users.get('/', async (req: Request<{}, {}, {}, ListUsersRequestQuery>, res: Response) => {
  const page = req.query.page
  const size = req.query.size
  const email = req.query.email
  const username = req.query.username

  const where: WhereOptions = {}

  if (email) where.email = { [Op.like]: '%' + email + '%' }
  if (username) where.username = { [Op.like]: '%' + username + '%' }

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))
  const options: FindOptions = { where, limit: paginationInfo.limit, offset: paginationInfo.offset }

  const users = await listUsers(options)

  res.status(200).json(usersView(users, paginationInfo))
})

users.get('/:username', async (req: Request<GetUserRequestParams>, res: Response, next: NextFunction) => {
  const username = req.params.username

  const user = await getUserByUsername(username)

  if (!(user instanceof User)) return next(user)

  res.status(200).json({ user: userView(user) })
})

users.get('/:username/list', async (req: Request<GetUserRequestParams, {}, {}, ListAnimesRequestQuery>, res: Response, next: NextFunction) => {
  const username = req.params.username

  const user = await getUserByUsername(username)

  if (!(user instanceof User)) return next(user)

  const page = req.query.page
  const size = req.query.size
  const name = req.query.name
  const slug = req.query.slug
  const native = req.query.native
  const romaji = req.query.romaji

  const where: WhereOptions = {}
  if (name) where['$anime.name$'] = { [Op.like]: '%' + name + '%' }
  if (slug) where['$anime.slug$'] = { [Op.like]: '%' + slug + '%' }
  if (native) where['$anime.native$'] = { [Op.like]: '%' + native + '%' }
  if (romaji) where['$anime.romaji$'] = { [Op.like]: '%' + romaji + '%' }

  const paginationInfo = getPaginationInfo(Number.parseInt(page as string), Number.parseInt(size as string))

  const options: FindOptions = { where, limit: paginationInfo.limit, offset: paginationInfo.offset, include: [User, Anime] }

  const list = await getAnimeList(user, options)

  res.status(200).json(animeListView(list, paginationInfo))
})

users.post('/', async (req: Request<{}, {}, CreateUserRequestBody>, res: Response, next: NextFunction) => {
  const reqUser = req.body.user

  const invalidCreateUserRequest = new InvalidUserRequestBodyError('invalid create user request body', [])

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

  if (!(user instanceof User)) return next(user as UserCreationError)

  res.status(201).json({ user: userView(user) })
})

users.delete('/:id', async (req: Request<DeleteUserRequestParams>, res: Response, next: NextFunction) => {
  const result = await deleteUser(req.params.id)

  if (!result) { return res.status(204).send() }

  return next(result)
})

users.patch('/:id', async (req: Request<UpdateUserRequestParams, {}, UpdateUserRequestBody>, res: Response, next: NextFunction) => {
  const reqUser = req.body.user

  const invalidUpdateUserRequest = new InvalidUserRequestBodyError('invalid update user request body', [])

  if (!reqUser) {
    invalidUpdateUserRequest.fields.push({ field: 'user', description: 'should have an object \'user\'' })
    return next(invalidUpdateUserRequest)
  }

  const user = await updateUser(req.params.id, reqUser)

  if (!(user instanceof User)) return next(user)

  res.status(200).send({ user: userView(user) })
})

export default users
