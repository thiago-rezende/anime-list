import { Field } from '~/utils/fields'
import { CreationError, InvalidRequestBodyError, NotFoundError, UpdateError } from '~/errors/common'

export class AnimeNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message)

    this.name = 'AnimeNotFoundError'
  }
}

export class AnimeCreationError extends CreationError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'AnimeCreationError'
  }
}

export class AnimeUpdateError extends UpdateError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'AnimeUpdateError'
  }
}

export class InvalidAnimeRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields)

    this.name = 'InvalidAnimeRequestBodyError'
  }
}
