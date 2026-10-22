import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userTypeId = localStorage.getItem("user_type_id");
    const isAuthRoute =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/forget-password");

    if (!token && !isAuthRoute) {
      navigate("/login", { replace: true });
      return;
    }

    if (token && isAuthRoute) {
      if (userTypeId === "5") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      return;
    }

    if (token && !isAuthRoute) {
      if (userTypeId === "5") {
        // user_type = 5: only dashboard, master (only product), and profile
        const isMasterProductRoute =
          pathname === "/products" ||
          pathname?.startsWith("/products/") ||
          pathname?.startsWith("/add-product") ||
          pathname?.startsWith("/edit-product");
        const isCommonRoute =
          pathname === "/dashboard" ||
          pathname?.startsWith("/dashboard/") ||
          pathname === "/profile" ||
          pathname?.startsWith("/profile/");

        if (!isMasterProductRoute && !isCommonRoute) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } else if (userTypeId === "4") {
        // user_type = 4: dashboard, orders, create orders, quotes, and profile
        const isUser4AllowedRoute =
          pathname === "/" ||
          pathname?.startsWith("/dashboard") ||
          pathname?.startsWith("/orders") ||
          pathname?.startsWith("/quotes") ||
          pathname?.startsWith("/profile");

        if (!isUser4AllowedRoute) {
          navigate("/", { replace: true });
          return;
        }
      }
    }

    setIsChecking(false);
  }, [pathname, navigate]);

  if (isChecking) {
    return null
  }

  return <>{children}</>;
}
