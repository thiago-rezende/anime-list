import { User } from '@models/user'

export interface AnimeListItemView {
  id: string,
  userId: string,
  animeId: string,
  name: string,
  slug: string,
  native: string,
  romaji: string,
  synopsis: string,
  releaseDate: Date,
  startedAt?: Date,
  finishedAt?: Date
}

export interface AnimeListView {
  animes: Array<AnimeListItemView>
}

export function animeListView(user: User): AnimeListView | undefined {
  const animeList = user.animes

  if (!animeList) return undefined

  const view: AnimeListView = { animes: [] }

  animeList.forEach((anime) => {
    view.animes.push({
      id: anime.AnimeList.id,
      userId: anime.AnimeList.userId,
      animeId: anime.AnimeList.animeId,
      name: anime.name,
      slug: anime.slug,
      native: anime.native,
      romaji: anime.romaji,
      synopsis: anime.synopsis,
      releaseDate: anime.releaseDate,
      startedAt: anime.AnimeList.startedAt,
      finishedAt: anime.AnimeList.finishedAt
    })
  })

  return view
}
