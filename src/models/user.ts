import { Table, Column, Model, Unique, PrimaryKey, IsUUID, Default, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'users'
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string

  @Unique
  @Column
  declare email: string

  @Unique
  @Column
  declare username: string

  @Column
  declare password: string
}

export interface UserDTO {
  email: string,
  username: string,
  password: string
}
