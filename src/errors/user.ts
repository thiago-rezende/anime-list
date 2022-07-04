import { Field } from '@utils/fields'
import { CreationError, InvalidRequestBodyError, NotFoundError, UpdateError } from '@errors/common'

export class UserNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message)

    this.name = 'UserNotFoundError'
  }
}

export class UserCreationError extends CreationError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'UserCreationError'
  }
}

export class UserUpdateError extends UpdateError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'UserUpdateError'
  }
}

export class InvalidUserRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'InvalidUserRequestBodyError'
  }
}
