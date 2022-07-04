import { Field } from '@src/utils/fields'

export class AnimeNotFoundError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'AnimeNotFoundError'
  }
}

export class AnimeCreationError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'AnimeCreationError'
  }
}

export class AnimeUpdateError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'AnimeUpdateError'
  }
}

export class InvalidCreateAnimeRequestBodyError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'InvalidCreateAnimeRequestBodyError'
  }
}

export class InvalidUpdateAnimeRequestBodyError extends Error {
  fields: Array<Field>

  constructor(message: string, fields: Array<Field>) {
    super(message)

    this.fields = fields
    this.name = 'InvalidUpdateAnimeRequestBodyError'
  }
}
