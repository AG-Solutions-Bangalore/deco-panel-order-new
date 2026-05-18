"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, BookmarkCheck, Undo2,
  AlertTriangle, DollarSign, Settings, LogOut, Menu, X, BarChart3, Bell, QrCode,
} from "lucide-react";



// toto : change this all lables and icons to something more appropriate for deco panel
const GROUPS = [
  {
    label: "Main", items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ]
  },
  {
    label: "Management", items: [
      { label: "Students", icon: Users, path: "/dashboard/admin/students" },
      { label: "Books", icon: BookOpen, path: "/dashboard/admin/books" },
    ]
  },
  {
    label: "Transactions", items: [
      { label: "Borrow", icon: BookmarkCheck, path: "/dashboard/admin/borrow" },
      { label: "Returns", icon: Undo2, path: "/dashboard/admin/returns" },
      { label: "Overdue", icon: AlertTriangle, path: "/dashboard/admin/overdue" },
    ]
  },
  {
    label: "Finances", items: [
      { label: "Fines", icon: DollarSign, path: "/dashboard/admin/fines" },
    ]
  },
  {
    label: "Reports", items: [
      { label: "Reports", icon: BarChart3, path: "/dashboard/admin/reports" },
    ]
  },
  {
    label: "System", items: [
      { label: "Notifications", icon: Bell, path: "/dashboard/admin/notifications" },
      { label: "QR Labels", icon: QrCode, path: "/dashboard/admin/qr-labels" },
      { label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
    ]
  },
];

export function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-3 left-3 z-[60] btn btn-ghost p-2"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>
      {open && <div className="sidebar-backdrop open" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">Borrow<span>Manager</span></span>
        </div>
        <nav className="sidebar-nav">
          {GROUPS.map(g => (
            <div key={g.label} className="nav-group">
              <div className="nav-label">{g.label}</div>
              {g.items.map(n => {
                const active = pathname === n.path || (n.path !== "/" && pathname.startsWith(n.path));
                return (
                  <button
                    key={n.path}
                    onClick={() => { router.push(n.path); setOpen(false); }}
                    className={`nav-item ${active ? "active" : ""}`}
                  >
                    <span className="nav-icon"><n.icon size={15} /></span>
                    <span>{n.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={onLogout} className="nav-item mt-2 rounded-lg text-red-500! hover:bg-red-100!">
            <LogOut size={15} /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
