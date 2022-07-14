import { AnimeList } from '~/models/anime_list'

import { users } from '~/database/users'
import { animes } from '~/database/animes'

let animeList: Array<AnimeList> = []

async function seed() {
  animeList = []

  animeList.push(AnimeList.build({ userId: users[0].id, animeId: animes[0].id, startedAt: Date.now(), finishedAt: null }))

  animeList.push(AnimeList.build({ userId: users[1].id, animeId: animes[0].id, startedAt: Date.now(), finishedAt: null }))
  animeList.push(AnimeList.build({ userId: users[1].id, animeId: animes[1].id, startedAt: Date.now(), finishedAt: null }))

  await animeList[0].save()
  await animeList[1].save()
  await animeList[2].save()
}

export { seed, animeList }
