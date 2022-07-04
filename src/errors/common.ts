import { Field } from '@src/utils/fields'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'ValidationError'
  }
}

export class EmailValidationError extends ValidationError {
  constructor(message: string) {
    super(message)

    this.name = 'EmailValidationError'
  }
}

export class SlugValidationError extends ValidationError {
  constructor(message: string) {
    super(message)

    this.name = 'SlugValidationError'
  }
}

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
