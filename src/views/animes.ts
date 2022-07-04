import { Anime } from '@models/anime'
import { PaginationInfo } from '@utils/pagination'
import { Model } from 'sequelize-typescript'

export interface AnimeView {
  id: string,
  name: string,
  synopsis: string,
  releaseDate: Date
}

export interface AnimesView {
  animes: Array<AnimeView>,
  page: number,
  pageSize: number,
  totalPages: number,
  totalItems: number
}

type AnimesViewData<M extends Model> = { rows: Array<M>, count: number }

export function animesView(data: AnimesViewData<Anime>, paginationInfo: PaginationInfo): AnimesView {
  const view: AnimesView = {
    animes: [],
    page: paginationInfo.page,
    pageSize: paginationInfo.size,
    totalPages: Math.ceil(data.count / paginationInfo.limit),
    totalItems: data.count
  }

  data.rows.forEach(anime => {
    view.animes.push(animeView(anime))
  })

  return view
}

export function animeView(anime: Anime): AnimeView {
  return {
    id: anime.id,
    name: anime.name,
    synopsis: anime.synopsis,
    releaseDate: anime.releaseDate
  }
}
