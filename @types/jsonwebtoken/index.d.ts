import { User } from "@models/user";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user: User
  }
}
