export type UserListKind = "app" | "team";

export interface ManagedUser {
  id: number | string;
  full_name: string;
  email: string;
  mobile: string;
  user_status: string;
}

export interface UserListResponse {
  profile?: ManagedUser[];
}

export interface UserStatusUpdateResponse {
  code: number | string;
  msg?: string;
}
