import { User } from '@models/user'

const users: Array<User> = []

function seed() {
  users.push(User.build({ email: 'thiago.manoel.rezende@gmail.com', username: 'thiago-rezende', password: 'secret' }))
  users.push(User.build({ email: 'horus.he4rt@gmail.com', username: 'horus-he4rt', password: 'super_secret' }))

  users.forEach(user => {
    user.save()
  })
}

export { seed, users }
