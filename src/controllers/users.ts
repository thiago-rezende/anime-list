import { User, UserDTO } from '@models/user'
import { UserCreationError, UserNotFoundError, UserUpdateError } from '@errors/user'

import { FindOptions, Includeable, ValidationError } from 'sequelize'

export async function getUser(id: string, include?: Includeable | Includeable[]): Promise<User | UserNotFoundError> {
  const options: FindOptions = {
  }

  if (include) { options.include = include }

  const user = await User.findByPk(id, options)

  if (!user) return new UserNotFoundError('user not found')

  return user
}

export async function getUserByUsername(username: string, include?: Includeable | Includeable[]): Promise<User | UserNotFoundError> {
  const options: FindOptions = {
    where: { username }
  }

  if (include) { options.include = include }

  const user = await User.findOne(options)

  if (!user) return new UserNotFoundError('user not found')

  return user
}

export async function findUser(options: FindOptions): Promise<User | UserNotFoundError> {
  const user = await User.findOne(options)

  if (!user) return new UserNotFoundError('user not found')

  return user
}

export async function listUsers(options?: FindOptions): Promise<{ rows: Array<User>, count: number }> {
  const users = await User.findAndCountAll(options)

  return users
}

export async function createUser(data: UserDTO): Promise<User | UserCreationError> {
  const user = User.build({ ...data })

  try {
    await user.save()
  } catch (err) {
    const userCreationError = new UserCreationError('failed on user creation', [])

    const validationError = (err as ValidationError)

    validationError.errors.forEach(error => {
      userCreationError.fields.push({ field: error.path as string, description: error.message })
    })

    return userCreationError
  }

  return user
}

export async function deleteUser(id: string): Promise<UserNotFoundError | void> {
  const user = await User.findByPk(id)

  if (!user) return new UserNotFoundError('user not found')

  await user.destroy()
}

export async function updateUser(id: string, data: UserDTO): Promise<UserNotFoundError | User> {
  const user = await User.findByPk(id)

  if (!user) return new UserNotFoundError('user not found')

  const email = data.email
  const username = data.username
  const password = data.password

  if (email) user.email = email
  if (username) user.username = username
  if (password) user.password = password

  try {
    await user.save()
  } catch (err) {
    const userUpdateError = new UserUpdateError('failed on user creation', [])

    const validationError = (err as ValidationError)

    validationError.errors.forEach(error => {
      userUpdateError.fields.push({ field: error.path as string, description: error.message })
    })

    return userUpdateError
  }

  return user
}
