import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";

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
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { AppLogo } from "@/components/brand/app-logo";

import { loginSchema, LoginInput } from "../schemas/login-schema";
import { useLogin, extractBackendErrorMessage } from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onError: () => {
        reset({
          username: "",
          password: "",
        });
      },
    });
  };

  const getErrorMessage = () => {
    if (!error) return null;
    return extractBackendErrorMessage(error);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-8">
      {/* Header Area */}
      <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
        <AppLogo className="mb-2 size-14 lg:hidden" />
        <h1 className="text-3xl font-semibold tracking-tight text-text">
          Welcome back
        </h1>
        <p className="text-sm text-text-muted">
          Enter your credentials to access your account.
        </p>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {/* Unauthorised / Login Error Banner */}
          {isError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{getErrorMessage()}</span>
            </div>
          )}

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

          {/* Password Field */}
          <Field data-invalid={!!errors.password} data-disabled={isPending}>
            <div className="flex w-full items-center justify-between">
              <FieldLabel htmlFor="password" className="mb-0">
                Password
              </FieldLabel>
              <Link
                to="/forget-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                disabled={isPending}
                {...register("password")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon data-icon="inline-start" className="size-4" />
                  ) : (
                    <EyeIcon data-icon="inline-start" className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError errors={[errors.password]} />
          </Field>

          {/* Submit Button */}
          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending && (
              <Spinner
                data-icon="inline-start"
                className="size-4 animate-spin"
              />
            )}
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <a
          href="mailto:support@decopanel.in"
          className="font-medium text-primary hover:underline"
        >
          Contact Support
        </a>
      </p>
    </div>
  );
}
