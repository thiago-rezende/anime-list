import { User } from '@models/user'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user: User
  }
}
