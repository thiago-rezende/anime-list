import {
  Table,
  Column,
  Model,
  Unique,
  PrimaryKey,
  IsUUID,
  Default,
  DataType,
  Is,
  BelongsToMany
} from 'sequelize-typescript';

import { email as emailRegex } from '~/utils/regex';
import { EmailValidationError } from '~/errors/common';
import { Anime } from '~/models/anime';
import { AnimeList } from '~/models/anime_list';

function emailValidator(value: string) {
  if (!emailRegex.test(value)) {
    throw new EmailValidationError('invalid email address');
  }
}

@Table({
  tableName: 'users'
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string;

  @Unique
  @Is('email', emailValidator)
  @Column
  declare email: string;

  @Unique
  @Column
  declare username: string;

  @Column
  declare password: string;

  @BelongsToMany(() => Anime, () => AnimeList)
  declare animes: Array<Anime & { AnimeList: AnimeList }>;
}

export interface UserDTO {
  id?: string;
  email: string;
  username: string;
  password: string;
}
