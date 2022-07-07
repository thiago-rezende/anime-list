import { AnimeList } from '@models/anime_list'
import { Model } from 'sequelize-typescript'
import { PaginationInfo } from '@utils/pagination'

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
  animes: Array<AnimeListItemView>,
  page?: number,
  pageSize?: number,
  totalPages?: number,
  totalItems?: number
}

type AnimeListViewData<M extends Model> = { rows: Array<M>, count: number }

export function animeListView(list: AnimeListViewData<AnimeList>, paginationInfo?: PaginationInfo): AnimeListView {
  const view: AnimeListView = { animes: [] }

  if (paginationInfo) {
    view.page = paginationInfo.page
    view.pageSize = paginationInfo.size
    view.totalPages = Math.ceil(list.count / paginationInfo.limit)
    view.totalItems = list.count
  }

  list.rows.forEach((anime) => {
    view.animes.push({
      id: anime.id,
      userId: anime.userId,
      animeId: anime.animeId,
      name: anime.anime.name,
      slug: anime.anime.slug,
      native: anime.anime.native,
      romaji: anime.anime.romaji,
      synopsis: anime.anime.synopsis,
      releaseDate: anime.anime.releaseDate,
      startedAt: anime.startedAt,
      finishedAt: anime.finishedAt
    })
  })

  return view
}
