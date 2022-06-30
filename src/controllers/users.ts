import { User, UserDTO } from '@models/user'
import { UserCreationError } from '@errors/user'

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
