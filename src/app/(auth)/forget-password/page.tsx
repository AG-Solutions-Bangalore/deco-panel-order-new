import { Metadata } from "next";
import { ForgetPasswordPage } from "@/modules/auth/pages/forget-password-page";

export const metadata: Metadata = {
  title: "Forget Password | Deco Panel",
  description: "Reset your Deco Panel account password.",
};

export default function Page() {
  return <ForgetPasswordPage />;
}
