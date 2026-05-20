import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
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
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Contact Support
        </Link>
      </p>
    </div>
  );
}
