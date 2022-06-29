import { User } from "@models/user";
import { UserView } from "@src/views/users";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user: User | UserView
  }
}
