import { User } from '@models/user'

export interface UserView {
  id: string,
  username: string,
  email: string,
  password?: string
}

export interface UsersView {
  users: Array<UserView>,
  page: number,
  pages: number
}

export function usersView(users: Array<User>, page: number, pages: number): UsersView {
  const view: UsersView = {
    users: [],
    page,
    pages
  }

  users.forEach(user => {
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
