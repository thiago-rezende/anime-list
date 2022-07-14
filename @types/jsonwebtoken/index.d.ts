import { User } from "~/models/user";
import { UserView } from "~/views/users";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user: User | UserView
  }
}
