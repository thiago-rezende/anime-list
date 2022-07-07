import { Table, Column, Model, PrimaryKey, IsUUID, Default, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { User } from '@models/user'
import { Anime } from '@models/anime'

@Table({
  tableName: 'list'
})
export class AnimeList extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string

  @ForeignKey(() => User)
  @Column
  declare userId: string

  @BelongsTo(() => User)
  declare user: User

  @ForeignKey(() => Anime)
  @Column
  declare animeId: string

  @BelongsTo(() => Anime)
  declare anime: Anime

  @Column(DataType.DATEONLY)
  declare startedAt: Date

  @Column(DataType.DATEONLY)
  declare finishedAt: Date
}

export interface AnimeListDTO {
  id?: string
  userId: string,
  animeId: string,
  startedAt?: Date,
  finishedAt?: Date
}
