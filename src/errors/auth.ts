import { Field } from '@utils/fields'

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'AuthorizationError'
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'InvalidCredentialsError'
  }
}

export class InvalidAuthRequestBodyError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)
    this.fields = fields
    this.name = 'InvalidAuthRequestBodyError'
  }
}
