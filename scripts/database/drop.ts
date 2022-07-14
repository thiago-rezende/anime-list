import { sequelize } from '~/database/index';
import config from '~/config/database';
(async () => {
  console.log(`[database] <drop> dropping '${config.database}' database`);

  sequelize.options.logging = console.log;

  try {
    await sequelize.getQueryInterface().dropDatabase(config.database as string);
  } catch (error) {
    console.log(`[database] <drop> database '${config.database}' not found`);
  }

  await sequelize.close();
})();
