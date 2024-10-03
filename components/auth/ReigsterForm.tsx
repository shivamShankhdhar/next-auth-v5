"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
export const RegisterForm = () => {
  const [error, setError] = useState<String | undefined>("");
  const [success, setSuccess] = useState<String | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    // transition is used to handle pending state
    startTransition(() => {
      register(values).then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an Account"
      backBttonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* form error  */}
            <FormError message={error} />
            {/* form Success  */}
            <FormSuccess message={success} />
            {/* submit button  */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      {...field}
                      placeholder="John Doe"
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
                      disabled={isPending}
                      type="email"
                      {...field}
                      placeholder="john.doe@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* password field  */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit" className="w-full">
              Create an Account
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

// export default loginForm
