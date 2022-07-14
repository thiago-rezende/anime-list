import { User } from '~/models/user';
import { Anime } from '~/models/anime';
import { AnimeList, AnimeListDTO } from '~/models/anime_list';

import { FindOptions, ValidationError } from 'sequelize';
import { UserNotFoundError } from '~/errors/user';
import { AnimeNotFoundError } from '~/errors/anime';
import { getUser } from '~/controllers/users';
import { getAnime } from '~/controllers/animes';
import { CreationError, NotFoundError } from '~/errors/common';

export async function getAnimeList(
  user: User,
  options: FindOptions
): Promise<{ rows: Array<AnimeList>; count: number }> {
  options.where = { ...options.where, userId: user.id };
  const list = await AnimeList.findAndCountAll(options);

  return list;
}

export async function addAnimeToList(
  data: AnimeListDTO
): Promise<AnimeList | UserNotFoundError | AnimeNotFoundError | CreationError> {
  const user = await getUser(data.userId);

  if (user instanceof UserNotFoundError) return user;

  const anime = await getAnime(data.animeId);

  if (anime instanceof AnimeNotFoundError) return anime;

  const listItem = AnimeList.build(
    {
      userId: user.id,
      animeId: anime.id,
      startedAt: data.startedAt,
      finishedAt: data.finishedAt
    },
    { include: [Anime, User] }
  );
  listItem.user = user;
  listItem.anime = anime;

  try {
    await listItem.save();
  } catch (error) {
    if (error instanceof ValidationError) {
      return new CreationError('anime already on your list', []);
    }
  }

  return listItem;
}

export async function removeAnimeFromList(
  data: AnimeListDTO
): Promise<
  void | UserNotFoundError | AnimeNotFoundError | CreationError | NotFoundError
> {
  const user = await getUser(data.userId);

  if (user instanceof UserNotFoundError) return user;

  const anime = await getAnime(data.animeId);

  if (anime instanceof AnimeNotFoundError) return anime;

  const item = await AnimeList.findOne({
    where: { userId: user.id, animeId: anime.id }
  });

  if (!(item instanceof AnimeList))
    return new NotFoundError('anime not on your list');

  await item.destroy();
}
