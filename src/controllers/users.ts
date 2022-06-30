import { User, UserDTO } from '@models/user'
import { UserCreationError, UserNotFoundError } from '@errors/user'

import { ValidationError } from 'sequelize/types'

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
