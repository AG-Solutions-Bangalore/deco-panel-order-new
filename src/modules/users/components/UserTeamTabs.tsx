import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserListKind } from "../types";

export function UserTeamTabs({ value }: { value: UserListKind }) {
  const navigate = useNavigate();

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => {
        navigate(nextValue === "team" ? "/users/team" : "/users");
      }}
      className="w-full"
    >
      <TabsList className="bg-muted/65 p-1 rounded-xl">
        <TabsTrigger value="app" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer">
          App Users
        </TabsTrigger>
        <TabsTrigger value="team" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer">
          Team
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
