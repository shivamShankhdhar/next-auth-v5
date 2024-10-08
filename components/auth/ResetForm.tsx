"use client";
import React, { useState } from "react";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";

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

import { reset } from "@/actions/reset";

export const ResetForm = () => {
  const [error, setError] = useState<String | undefined>("");
  const [success, setSuccess] = useState<String | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    // transition is used to handle pending state
    startTransition(() => {
      reset(values).then((res: any) => {
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
      headerLabel="Forgot your Password"
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

            {/* submit button  */}
            <Button disabled={isPending} type="submit" className="w-full">
              Send reset email
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

// export default loginForm
