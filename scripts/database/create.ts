import { Sequelize } from '~/database/index';

import config from '~/config/database';

import { Dialect } from 'sequelize';
(async () => {
  console.log(`[database] <create> creating '${config.database}' database`);

  const sequelize = new Sequelize({
    username: config.username as string,
    password: config.password as string,
    dialect: config.dialect as Dialect,
    host: config.host as string,
    logging: console.log
  });

  await sequelize
    .getQueryInterface()
    .createDatabase(
      config.database as string /*, { charset: 'utf32', collate: 'utf32_general_ci' } */
    );

  await sequelize.close();
})();
