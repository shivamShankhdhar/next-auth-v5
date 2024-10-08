"use client";
import React, { useState } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition } from "react";

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

import { login } from "@/actions/login";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const urlError =
    searchParams?.get("error") === "OAuthAccountNotLinked"
      ? "Email Already in use with different provider!"
      : "";

  const [error, setError] = useState<String | undefined>("");
  const [success, setSuccess] = useState<String | undefined>("");

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      code: "",
      email: "",
      password: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    // transition is used to handle pending state
    startTransition(() => {
      login(values)
        .then((res: any) => {
          if (res?.error) {
            form.reset();
            setError(res.error);
          }
          if (res?.success) {
            form.reset();
            setSuccess(res.success);
          }

          if (res?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backBttonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* form error  */}
            <FormError message={error || urlError} />
            {/* form Success  */}
            <FormSuccess message={success} />
            {/* submit button  */}
            {/* two factor code input  */}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="text"
                        {...field}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              // login credentials
              <>
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
                      <Button
                        size={"sm"}
                        variant="link"
                        className="px-0 font-normal"
                        asChild
                      >
                        <Link href={"/auth/reset"}>Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {/* submit button  */}
            <Button disabled={isPending} type="submit" className="w-full">
              {showTwoFactor ? "Confirm" : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

// export default loginForm
