"use client";
import React, { useState } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";

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

import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const [error, setError] = useState<String | undefined>("");
  const [success, setSuccess] = useState<String | undefined>("");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    // transition is used to handle pending state
    startTransition(() => {
      newPassword(values, token).then((res: any) => {
        if (res !== undefined) {
          if (res.error !== undefined) {
            setError(res.error);
          } else {
            setSuccess(res.success);
          }
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backBttonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      {...field}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* submit button  */}
            <Button disabled={isPending} type="submit" className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

// export default loginForm
