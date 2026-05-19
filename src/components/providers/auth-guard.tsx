import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthRoute =
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/register") ||
      pathname?.startsWith("/forget-password");

    if (!token && !isAuthRoute) {
      navigate("/login", { replace: true });
    } else if (token && isAuthRoute) {
      navigate("/", { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [pathname, navigate]);

  if (isChecking) {
    return null
  }

  return <>{children}</>;
}
