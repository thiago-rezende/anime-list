import env, { EnvironmentConfig } from '~/config/environment'
import jwt, { JwtConfig } from '~/config/jwt'
import db, { DBConfig } from '~/config/database'

export interface Config {
  env: EnvironmentConfig,
  jwt: JwtConfig,
  db: DBConfig
}

const config: Config = {
  env,
  jwt,
  db
}

export default config
