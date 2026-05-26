import { UsersListPage } from "@/modules/users/pages/users-list-page";

export function AppUsersRoute() {
  return <UsersListPage kind="app" />;
}

export function TeamUsersRoute() {
  return <UsersListPage kind="team" />;
}
