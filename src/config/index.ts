import env, { EnvironmentConfig } from '@config/environment'
import jwt, { JwtConfig } from '@config/jwt'

export interface Config {
  env: EnvironmentConfig,
  jwt: JwtConfig
}

const config: Config = {
  env,
  jwt
}

export default config
