import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { ForgetPasswordInput } from "../schemas/forget-password-schema";

export function useForgetPassword() {
  return useMutation({
    mutationFn: async (data: ForgetPasswordInput) => {
      // The API expects parameters in the URL query string
      const response = await api.post(
        `/send-password?username=${encodeURIComponent(data.username)}&email=${encodeURIComponent(data.email)}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      // We check for the nested message based on the old behavior, otherwise fallback
      toast.success(data?.data?.msg || "Password reset instructions sent.");
    },
    onError: (error: any) => {
      console.error("Reset Password Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials or user not found.";
      toast.error(errorMessage);
    },
  });
}
