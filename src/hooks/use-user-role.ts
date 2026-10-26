import { useEffect, useState } from "react";

export function useUserRole() {
  const [userTypeId, setUserTypeId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("user_type_id") || "";
  });

  useEffect(() => {
    const syncRole = () => {
      setUserTypeId(localStorage.getItem("user_type_id") || "");
    };

    window.addEventListener("storage", syncRole);
    window.addEventListener("user_role_changed", syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("user_role_changed", syncRole);
    };
  }, []);

  const isUser4 = userTypeId === "4";
  const isUser5 = userTypeId === "5";
  const isDefaultUser = !isUser4 && !isUser5; // user_type 2, 3, etc.

  return {
    userTypeId,
    isUser4,
    isUser5,
    isDefaultUser,
  };
}
