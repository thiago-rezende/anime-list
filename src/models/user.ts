import { Table, Column, Model } from 'sequelize-typescript'

@Table({
  tableName: 'users'
})
export class User extends Model {
  @Column
  declare email: string

  @Column
  declare username: string

  @Column
  declare password: string
}
