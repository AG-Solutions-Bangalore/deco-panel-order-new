import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  ManagedUser,
  UserListKind,
  UserListResponse,
  UserStatusUpdateResponse,
} from "../types";

const userListConfig = {
  app: {
    queryKey: ["app-users-list"],
    listEndpoint: "/web-fetch-users-list",
    updateEndpoint: "/web-update-users",
  },
  team: {
    queryKey: ["team-users-list"],
    listEndpoint: "/web-fetch-team-list",
    updateEndpoint: "/web-update-team",
  },
} satisfies Record<
  UserListKind,
  { queryKey: string[]; listEndpoint: string; updateEndpoint: string }
>;

export function getUserListConfig(kind: UserListKind) {
  return userListConfig[kind];
}

export function useManagedUsers(kind: UserListKind) {
  const config = getUserListConfig(kind);

  return useQuery({
    queryKey: config.queryKey,
    queryFn: async () => {
      const response = await api.get<UserListResponse>(config.listEndpoint);
      return response.data?.profile || [];
    },
  });
}

export function useToggleManagedUserStatus(kind: UserListKind) {
  const queryClient = useQueryClient();
  const config = getUserListConfig(kind);

  return useMutation({
    mutationFn: async (id: ManagedUser["id"]) => {
      const response = await api.put<UserStatusUpdateResponse>(
        `${config.updateEndpoint}/${id}`,
      );

      if (String(response.data.code) !== "200") {
        throw new Error(response.data.msg || "Failed to update user status");
      }

      return { id, message: response.data.msg || "User status updated" };
    },
    onSuccess: ({ id }) => {
      queryClient.setQueryData<ManagedUser[]>(config.queryKey, (previous = []) =>
        previous.map((user) =>
          user.id === id
            ? {
                ...user,
                user_status:
                  user.user_status === "Active" ? "Inactive" : "Active",
              }
            : user,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
    },
  });
}
