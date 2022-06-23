import users from '@database/users'
import { User } from '@models/user'

interface IDatabase {
  users: Array<User>
}

const database: IDatabase = {
  users
}

export default database
