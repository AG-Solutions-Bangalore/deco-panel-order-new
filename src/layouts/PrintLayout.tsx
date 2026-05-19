import { Outlet } from "react-router-dom";
import { AuthGuard } from "@/components/providers/auth-guard";
import { QueryProvider } from "@/components/providers/query-provider";

export function PrintLayout() {
  return (
    <QueryProvider>
      <AuthGuard>
        <main className="min-h-dvh bg-white text-black">
          <Outlet />
        </main>
      </AuthGuard>
    </QueryProvider>
  );
}
