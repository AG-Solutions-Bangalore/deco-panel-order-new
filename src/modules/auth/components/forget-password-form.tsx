"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

import { forgetPasswordSchema, ForgetPasswordInput } from "../schemas/forget-password-schema";
import { useForgetPassword } from "../hooks/use-forget-password";

export function ForgetPasswordForm() {
  const { mutate: resetPassword, isPending } = useForgetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = (data: ForgetPasswordInput) => {
    resetPassword(data);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-text">
          Forget Password
        </h1>
        <p className="text-sm text-text-muted">
          Enter your Username and Email to reset your password.
        </p>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {/* Username Field */}
          <Field data-invalid={!!errors.username} data-disabled={isPending}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="username"
                type="text"
                placeholder="Enter your username"
                aria-invalid={!!errors.username}
                disabled={isPending}
                {...register("username")}
              />
            </InputGroup>
            <FieldError errors={[errors.username]} />
          </Field>

          {/* Email Field */}
          <Field data-invalid={!!errors.email} data-disabled={isPending}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                type="email"
                placeholder="name@example.com"
                aria-invalid={!!errors.email}
                disabled={isPending}
                {...register("email")}
              />
            </InputGroup>
            <FieldError errors={[errors.email]} />
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isPending}
          >
            {isPending && (
              <Spinner data-icon="inline-start" className="size-4 animate-spin" />
            )}
            {isPending ? "Sending..." : "Reset Password"}
          </Button>
        </FieldGroup>
      </form>
      
      <p className="text-center text-sm text-text-muted">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
