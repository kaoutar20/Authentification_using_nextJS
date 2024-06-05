"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,  
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";



export const LoginForm = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

      const [showPassword, setShowPassword] = useState(false);

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };


    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");

        startTransition(()=> {
            login(values)
            .then((data) => {
                setError(data?.error);
                //setSuccess(data?.success);
            })
        });
    };
      

      
    return (
        <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
        > 
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit) }
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="nom.prenom@email.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />

                     
                        
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                    </div>

                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>

                    <Button 
                    disabled={isPending}
                    type="submit"
                    className="w-full">
                        Login 
                    </Button>

                </form>
            </Form>
                
        </CardWrapper>
    );
}
export default LoginForm;  