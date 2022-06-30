import { Field } from '@src/utils/fields'

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'UserNotFoundError'
  }
}

export class UserCreationError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'UserCreationError'
  }
}

export class InvalidCreateUserRequestBodyError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'InvalidCreateUserRequestBodyError'
  }
}
