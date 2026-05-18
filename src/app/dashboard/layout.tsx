"use client";

import { Sidebar } from "@/components/layouts/sidebar";
// import { Topbar } from "@/components/layouts/topbar";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // const { user, isAdmin } = useAuthUser();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.replace("/login");
  //     return;
  //   }
  //   if (user && !isAdmin) {
  //     router.replace("/");
  //   }
  // }, [router, user, isAdmin]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />
      {/* <Topbar /> */}
      <main className="main">
        <div className="page">{children}</div>
      </main>
    </div>
  );
}
