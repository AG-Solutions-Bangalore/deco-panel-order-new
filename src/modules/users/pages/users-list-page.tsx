import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { useWebHaptics } from "web-haptics/react";
import { UserTeamTabs } from "../components/UserTeamTabs";
import { UsersTable } from "../components/UsersTable";
import { useManagedUsers, useToggleManagedUserStatus } from "../hooks/use-users";
import type { ManagedUser, UserListKind } from "../types";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

export function UsersListPage({ kind }: { kind: UserListKind }) {
  const { trigger } = useWebHaptics();
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<ManagedUser["id"] | null>(null);
  const { data: users = [], isLoading } = useManagedUsers(kind);
  const toggleMutation = useToggleManagedUserStatus(kind);
  const isTeam = kind === "team";

  const handleToggleStatus = (id: ManagedUser["id"]) => {
    trigger("medium");
    setTogglingId(id);
    toggleMutation.mutate(id, {
      onSuccess: (result) => {
        toast.success(result.message);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Failed to update user status"));
      },
      onSettled: () => {
        setTogglingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader
        title={isTeam ? "Team List" : "App Users List"}
        subtitle={
          isTeam
            ? "Manage team access and active status."
            : "Manage app user access and active status."
        }
      />

      <UserTeamTabs value={kind} />

      <UsersTable
        users={users}
        isLoading={isLoading}
        search={search}
        togglingId={togglingId}
        onSearchChange={setSearch}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
