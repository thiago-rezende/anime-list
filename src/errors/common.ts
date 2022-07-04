import { Field } from '@src/utils/fields'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'NotFoundError'
  }
}

export class CreationError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'CreationError'
  }
}

export class UpdateError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'UpdateError'
  }
}

export class InvalidRequestBodyError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'InvalidRequestBodyError'
  }
}
