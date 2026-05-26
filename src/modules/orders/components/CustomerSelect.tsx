import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Plus, Search, User, X } from "lucide-react";
import type { UserProfile } from "../types";

type TriggerHaptic = (pattern: "light" | "medium" | "heavy") => void;

interface CustomerSelectProps {
  users: UserProfile[];
  userId: string;
  onSelectUser: (userId: string) => void;
  onCreateCustomer: () => void;
  trigger: TriggerHaptic;
}

export function CustomerSelect({
  users,
  userId,
  onSelectUser,
  onCreateCustomer,
  trigger,
}: CustomerSelectProps) {
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(userSearch.toLowerCase()),
  );
  const selectedUser = users.find((user) => String(user.id) === String(userId));

  return (
    <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 select-none">
          <User className="size-3.5 text-primary" />
          Select Customer
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            trigger("light");
            setOpenUserDropdown(false);
            onCreateCustomer();
          }}
          className="h-7 rounded-lg px-2 text-[11px] font-bold gap-1 cursor-pointer"
        >
          <Plus className="size-3" />
          New
        </Button>
      </div>

      <button
        type="button"
        onClick={() => {
          trigger("light");
          setOpenUserDropdown(!openUserDropdown);
        }}
        className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-all cursor-pointer text-left flex items-center justify-between text-text"
      >
        <span className={userId ? "text-text" : "text-text-muted font-normal"}>
          {selectedUser?.full_name || "Select Customer Profile..."}
        </span>
        <ChevronDown
          className={`size-4 text-text-muted transition-transform duration-200 ${
            openUserDropdown ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {openUserDropdown && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-popover border border-border rounded-xl shadow-lg z-50 flex flex-col overflow-hidden max-h-60 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-border/60 bg-muted/10 relative flex items-center">
            <Search className="absolute left-4 size-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search customer..."
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              className="w-full bg-background border border-border/80 rounded-lg pl-8 pr-8 py-1.5 text-xs font-medium outline-none focus:border-primary/50 transition-all placeholder:text-text-muted text-text"
              onClick={(event) => event.stopPropagation()}
            />
            {userSearch && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  trigger("light");
                  setUserSearch("");
                }}
                className="absolute right-4 text-text-muted hover:text-text rounded-full p-0.5 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto p-1 scrollbar-thin max-h-40">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = String(user.id) === String(userId);

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      trigger("light");
                      onSelectUser(String(user.id));
                      setOpenUserDropdown(false);
                      setUserSearch("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-text hover:bg-primary/5"
                    }`}
                  >
                    <span>{user.full_name}</span>
                    {isSelected && (
                      <Check className="size-3.5 text-primary-foreground" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-text-muted font-medium">
                No customers found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
