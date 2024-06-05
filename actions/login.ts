"use server"

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const   login = async (values:  z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
      }

      //return { success: "Confirmation email sent!" };

    const { email, password, code } = validatedFields.data;

      try {
        await signIn("credentials", {
          email,
          password,
          //redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
          redirectTo: DEFAULT_LOGIN_REDIRECT
        })
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return { error: "Invalid credentials!" }
            default:
              return { error: "Something went wrong!" }
          }
        }
        
        throw error;
      }
    
};