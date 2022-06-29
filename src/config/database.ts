import { Options, Dialect } from 'sequelize'

export type DBConfig = Options

const db: DBConfig = {
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  dialect: (process.env.DB_DIALECT as Dialect) || 'sqlite',
  storage: process.env.DB_STORAGE || ':memory:',
  host: process.env.DB_HOST || ''
}

export default db
