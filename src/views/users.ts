import { User } from '@models/user'
import { Anime } from '@models/anime'
import { PaginationInfo } from '@utils/pagination'
import { Model } from 'sequelize-typescript'

export interface UserView {
  id: string,
  username: string,
  email: string,
  password?: string,
  animes?: Array<Anime>
}

export interface UsersView {
  users: Array<UserView>,
  page: number,
  pageSize: number,
  totalPages: number,
  totalItems: number
}

type UsersViewData<M extends Model> = { rows: Array<M>, count: number }

export function usersView(data: UsersViewData<User>, paginationInfo: PaginationInfo): UsersView {
  const view: UsersView = {
    users: [],
    page: paginationInfo.page,
    pageSize: paginationInfo.size,
    totalPages: Math.ceil(data.count / paginationInfo.limit),
    totalItems: data.count
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
    email: user.email,
    animes: user.animes
  }
}
