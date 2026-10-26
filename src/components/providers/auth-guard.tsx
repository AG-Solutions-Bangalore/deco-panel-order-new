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
        // user_type = 5: dashboard, master (only product), orders, create order, quotes, reports (all 3), profile
        const isUser5AllowedRoute =
          pathname === "/" ||
          pathname?.startsWith("/dashboard") ||
          pathname?.startsWith("/orders") ||
          pathname?.startsWith("/quotes") ||
          pathname === "/products" ||
          pathname?.startsWith("/products/") ||
          pathname?.startsWith("/add-product") ||
          pathname?.startsWith("/edit-product") ||
          pathname?.startsWith("/product-report") ||
          pathname?.startsWith("/order-report") ||
          pathname?.startsWith("/quotation-report") ||
          pathname?.startsWith("/order-view-report") ||
          pathname?.startsWith("/quotation-view-report") ||
          pathname === "/profile" ||
          pathname?.startsWith("/profile/");

        if (!isUser5AllowedRoute) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } else if (userTypeId === "4") {
        // user_type = 4: dashboard, orders, create orders, quotes, reports (only order and quotation report), profile
        const isUser4AllowedRoute =
          pathname === "/" ||
          pathname?.startsWith("/dashboard") ||
          pathname?.startsWith("/orders") ||
          pathname?.startsWith("/quotes") ||
          pathname?.startsWith("/order-report") ||
          pathname?.startsWith("/quotation-report") ||
          pathname?.startsWith("/order-view-report") ||
          pathname?.startsWith("/quotation-view-report") ||
          pathname === "/profile" ||
          pathname?.startsWith("/profile/");

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
