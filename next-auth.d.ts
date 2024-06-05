import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  id: string;
  //role: "ADMIN" | "USER"
  
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

