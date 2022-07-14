import { Anime } from '~/models/anime';
import { PaginationInfo } from '~/utils/pagination';
import { Model } from 'sequelize-typescript';

export interface AnimeView {
  id: string;
  name: string;
  slug: string;
  native: string;
  romaji: string;
  synopsis: string;
  releaseDate: Date;
}

export interface AnimesView {
  animes: Array<AnimeView>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
}

type AnimesViewData<M extends Model> = { rows: Array<M>; count: number };

export function animesView(
  data: AnimesViewData<Anime> | Array<Anime>,
  paginationInfo?: PaginationInfo
): AnimesView {
  let view: AnimesView;

  if (paginationInfo && !(data instanceof Array)) {
    view = {
      animes: [],
      page: paginationInfo.page,
      pageSize: paginationInfo.size,
      totalPages: Math.ceil(
        (data as AnimesViewData<Anime>).count / paginationInfo.limit
      ),
      totalItems: (data as AnimesViewData<Anime>).count
    };
    (data as AnimesViewData<Anime>).rows.forEach((anime) => {
      view.animes.push(animeView(anime));
    });
  } else {
    view = {
      animes: []
    };

    const animes: Array<Anime> = data as Array<Anime>;

    animes.forEach((anime) => {
      view.animes.push(animeView(anime));
    });
  }

  return view;
}

export function animeView(anime: Anime): AnimeView {
  return {
    id: anime.id,
    name: anime.name,
    slug: anime.slug,
    native: anime.native,
    romaji: anime.romaji,
    synopsis: anime.synopsis,
    releaseDate: anime.releaseDate
  };
}
