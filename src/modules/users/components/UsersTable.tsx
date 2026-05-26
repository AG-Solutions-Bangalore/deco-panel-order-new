import { useState } from "react";
import { Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ManagedUser } from "../types";

interface UsersTableProps {
  users: ManagedUser[];
  isLoading: boolean;
  search: string;
  togglingId: ManagedUser["id"] | null;
  onSearchChange: (value: string) => void;
  onToggleStatus: (id: ManagedUser["id"]) => void;
}

function matchesUserSearch(user: ManagedUser, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  return [
    user.full_name,
    user.email,
    user.mobile,
    user.user_status,
  ].some((value) => String(value || "").toLowerCase().includes(normalizedQuery));
}

function StatusPill({ status }: { status: string }) {
  const isActive = status === "Active";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        isActive
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {status || "Unknown"}
    </span>
  );
}

interface StatusToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function StatusToggleSwitch({
  checked,
  onChange,
  disabled,
  isLoading,
}: StatusToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled || isLoading}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked
          ? "bg-emerald-500 dark:bg-emerald-600 shadow-sm shadow-emerald-500/20"
          : "bg-muted-foreground/30 dark:bg-muted/20 border-muted/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {/* Sliding Thumb */}
      <span
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-md transition-all duration-300 ease-in-out",
          checked
            ? "translate-x-5"
            : "translate-x-0"
        )}
      >
        {isLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
        )}
      </span>
    </button>
  );
}

export function UsersTable({
  users,
  isLoading,
  search,
  togglingId,
  onSearchChange,
  onToggleStatus,
}: UsersTableProps) {
  const [sortField, setSortField] = useState<keyof ManagedUser | "sl_no" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredUsers = users.filter((user) => matchesUserSearch(user, search));

  const handleSort = (field: keyof ManagedUser | "sl_no") => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: any;
    let bValue: any;

    if (sortField === "sl_no") {
      aValue = a.id;
      bValue = b.id;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (aValue === undefined || aValue === null) aValue = "";
    if (bValue === undefined || bValue === null) bValue = "";

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (aString < bString) return sortDirection === "asc" ? -1 : 1;
    if (aString > bString) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Card className="bg-panel py-0 border border-border/80 shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search users..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Showing {sortedUsers.length} of {users.length}
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/40">
            <TableRow className="hover:bg-transparent">
              <TableHead
                onClick={() => handleSort("sl_no")}
                className="w-24 px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  SL No
                  {sortField === "sl_no" ? (
                    sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("full_name")}
                className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  Full Name
                  {sortField === "full_name" ? (
                    sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("email")}
                className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortField === "email" ? (
                    sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("mobile")}
                className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  Mobile
                  {sortField === "mobile" ? (
                    sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                  )}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("user_status")}
                className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "user_status" ? (
                    sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-24 px-4 py-3.5 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Spinner className="size-5 animate-spin text-primary" />
                    <span className="text-sm font-semibold">Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedUsers.length ? (
              sortedUsers.map((user, index) => {
                const isToggleLoading = togglingId === user.id;
                const isActive = user.user_status === "Active";

                return (
                  <TableRow key={user.id} className="border-b border-border/40">
                    <TableCell className="px-4 py-3 font-semibold text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-bold text-foreground">
                      {user.full_name || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.email || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.mobile || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusPill status={user.user_status} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end">
                        <StatusToggleSwitch
                          checked={isActive}
                          onChange={() => onToggleStatus(user.id)}
                          isLoading={isToggleLoading}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <p className="text-sm font-semibold">
                    Sorry, there is no matching data to display.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
