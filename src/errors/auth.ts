import { Field } from '@utils/fields'
import { InvalidRequestBodyError } from '@errors/common'

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'AuthorizationError'
  }
}

export class InvalidCredentialsError extends AuthorizationError {
  constructor(message: string) {
    super(message)

    this.name = 'InvalidCredentialsError'
  }
}

export class InvalidAuthRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)
    this.name = 'InvalidAuthRequestBodyError'
  }
}
