import { User } from '@models/user'

let users: Array<User> = []

async function seed() {
  users = []

  users.push(User.build({ email: 'thiago.manoel.rezende@gmail.com', username: 'thiago-rezende', password: 'secret' }))
  users.push(User.build({ email: 'horus.he4rt@gmail.com', username: 'horus-he4rt', password: 'super_secret' }))

  await users[0].save()
  await users[1].save()
}

export { seed, users }
