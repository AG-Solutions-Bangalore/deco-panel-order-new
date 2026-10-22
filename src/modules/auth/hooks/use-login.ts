import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { LoginInput } from "../schemas/login-schema";

export function extractBackendErrorMessage(error: any): string {
  if (!error) return "An error occurred during login.";

  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }
  if (data && typeof data === "object") {
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
    if (typeof data.msg === "string" && data.msg.trim()) {
      return data.msg.trim();
    }
    if (typeof data.data?.msg === "string" && data.data.msg.trim()) {
      return data.data.msg.trim();
    }
    if (data.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      const firstVal = data.errors[firstKey];
      if (Array.isArray(firstVal) && firstVal.length > 0) {
        return String(firstVal[0]);
      }
      if (typeof firstVal === "string" && firstVal.trim()) {
        return firstVal.trim();
      }
    }
  }

  if (error?.message && typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  if (error?.response?.status === 401) {
    return "Unauthorised";
  }

  return "An error occurred during login.";
}

export function useLogin() {
  const navigate = useNavigate();

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

      // Handle cases where the backend returns HTTP 200 with an error status or message
      if (
        response.data?.status === false ||
        response.data?.error ||
        (response.data?.code && response.data.code !== 200) ||
        !response.data?.UserInfo?.token
      ) {
        const errorMsg =
          response.data?.error ||
          response.data?.message ||
          response.data?.msg ||
          "Unauthorised";
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: (data) => {
      const token = data?.UserInfo?.token;
      const user = data?.UserInfo?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user_type_id", user?.user_type_id || "");
        localStorage.setItem("id", user?.id || "");
        localStorage.setItem("username", user?.name || "");
        localStorage.setItem("email", user?.email || "");

        window.dispatchEvent(new Event("user_role_changed"));
        toast.success("User Logged In Successfully");
        if (String(user?.user_type_id) === "5") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      const errorMessage = extractBackendErrorMessage(error);
      toast.error(errorMessage);
    },
  });
}
