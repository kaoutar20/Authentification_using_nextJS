"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";



export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
          email: "",
          password: "",
          name: "",
        },
      });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {

        setError("");
        setSuccess("");

        startTransition(()=> {
            register(values)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        });
    };
      

      
    return (
        <CardWrapper
        headerLabel="Create Account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
        > 
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit) }
                className="space-y-6">
                    <div className="space-y-4">

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="nom.prenom"
                            type="text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                    <FormError message={error}/>
                    <FormSuccess message={success}/>

                    <Button 
                    disabled={isPending}
                    type="submit"
                    className="w-full">
                        Register 
                    </Button>

                </form>
            </Form>
                
        </CardWrapper>
    );
}
export default RegisterForm;  