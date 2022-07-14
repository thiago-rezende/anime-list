import { User } from '~/models/user'
import { PaginationInfo } from '~/utils/pagination'
import { Model } from 'sequelize-typescript'

export interface UserView {
  id: string,
  username: string,
  email: string,
  password?: string
}

export interface UsersView {
  users: Array<UserView>,
  page?: number,
  pageSize?: number,
  totalPages?: number,
  totalItems?: number
}

type UsersViewData<M extends Model> = { rows: Array<M>, count: number }

export function usersView(data: UsersViewData<User>, paginationInfo?: PaginationInfo): UsersView {
  const view: UsersView = { users: [] }

  if (paginationInfo) {
    view.page = paginationInfo.page
    view.pageSize = paginationInfo.size
    view.totalPages = Math.ceil(data.count / paginationInfo.limit)
    view.totalItems = data.count
  }

  data.rows.forEach(user => {
    view.users.push(userView(user))
  })

  return view
}

export function userView(user: User): UserView {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  }
}
