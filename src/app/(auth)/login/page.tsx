import { Metadata } from "next";
import { LoginPage } from "@/modules/auth/pages/login-page";

export const metadata: Metadata = {
  title: "Login | Deco Panel",
  description: "Sign in to your Deco Panel account to manage your panels and orders.",
};

export default function Page() {
  return <LoginPage />;
}
