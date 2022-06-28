import users from '@database/users'
import { User } from '@models/user'

interface Database {
  users: Array<User>
}

const database: Database = {
  users
}

export default database
