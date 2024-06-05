import NextAuth, {DefaultSession} from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import { db } from "./lib/db";
import authConfig from "./auth.config"
import { getUserById } from "@/data/user";




export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
    events: {
      async linkAccount({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        })
      }
    },

    callbacks: {
      async session({token, session}){
        //console.log({sessionToken: token,session, })
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (token.role && session.user) {
          session.user.role = token.role as UserRole; // "ADMIN" | "USER"
        }
  

        if(session.user) {
          session.user.customField = token.customField;
        }
        return session;
      }, 
      async jwt({ token}) {
        //console.log({token});
        //token.customField =  'Custom Value';

        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);
  
        if (!existingUser) return token;

        token.role = existingUser.role;
  
        return token;
      }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  
});


