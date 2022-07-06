import { Table, Column, Model, PrimaryKey, IsUUID, Default, DataType, Unique, Is, BelongsToMany } from 'sequelize-typescript'

import { slug as slugRegex } from '@utils/regex'
import { SlugValidationError } from '@errors/common'

import { User } from '@models/user'
import { AnimeList } from '@models/anime_list'

function slugValidator(value: string) {
  if (!slugRegex.test(value)) { throw new SlugValidationError('slug should only have alphanumeric letters, numbers and hyphens') }
}

@Table({
  tableName: 'animes'
})
export class Anime extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string

  @Column
  declare name: string

  @Unique
  @Is('slug', slugValidator)
  @Column
  declare slug: string

  @Column
  declare native: string

  @Column
  declare romaji: string

  @Column(DataType.TEXT)
  declare synopsis: string

  @Column(DataType.DATEONLY)
  declare releaseDate: Date

  @BelongsToMany(() => User, () => AnimeList)
  declare users: Array<User & { AnimeList: AnimeList }>
}

export interface AnimeDTO {
  id?: string,
  name: string,
  slug: string,
  native: string,
  romaji: string,
  synopsis: string,
  releaseDate: Date
}
