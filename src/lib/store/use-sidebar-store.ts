import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setOpen: (open: boolean) => void;
}

function getInitialSidebarState() {
  if (typeof window === "undefined") return true;

  try {
    const storedValue = window.localStorage.getItem("sidebar-storage");
    if (!storedValue) return true;

    const parsedValue = JSON.parse(storedValue);
    return parsedValue?.state?.isOpen ?? true;
  } catch {
    return true;
  }
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: getInitialSidebarState(),
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "sidebar-storage", // Key in localStorage
    }
  )
);
