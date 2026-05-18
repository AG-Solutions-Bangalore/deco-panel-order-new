"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { LoginInput } from "../schemas/login-schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      // We use multipart/form-data since the backend expects FormData for login
      const response = await api.post("/web-login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      const token = data.UserInfo?.token;
      const user = data.UserInfo?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user_type_id", user?.user_type_id || "");
        localStorage.setItem("id", user?.id || "");
        localStorage.setItem("username", user?.name || "");
        localStorage.setItem("email", user?.email || "");

        toast.success("User Logged In Successfully");
        router.push("/");
      } else {
        toast.error("Login Failed: Token not received.");
      }
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
}
