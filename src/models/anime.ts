import { Table, Column, Model, PrimaryKey, IsUUID, Default, DataType, Unique } from 'sequelize-typescript'

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

  @Column
  declare native: string

  @Column
  declare romaji: string

  @Unique
  @Column
  declare slug: string

  @Column(DataType.TEXT)
  declare synopsis: string

  @Column(DataType.DATEONLY)
  declare releaseDate: Date
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
