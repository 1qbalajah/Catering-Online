"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bike,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getSidebarByRole } from "@/lib/sidebar";
import type { Role } from "@/types";

type SidebarProps = {
  role: Role;
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const menu = getSidebarByRole(role);
  const activeHref =
    [...menu]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href ?? menu[0]?.href;
  const iconByHref = {
    "/dashboard": LayoutDashboard,
    "/dashboard/profile": UserRound,
    "/dashboard/profile/edit": UserRound,
    "/dashboard/admin": LayoutDashboard,
    "/dashboard/admin/orders": ClipboardList,
    "/dashboard/admin/data/paket": Package,
    "/dashboard/admin/reports": BarChart3,
    "/dashboard/kurir": Bike,
    "/dashboard/kurir/riwayat": ClipboardList,
    "/dashboard/owner": LayoutDashboard,
    "/dashboard/owner/analytics": BarChart3,
    "/dashboard/owner/reports": ClipboardList,
  } as const;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><Boxes size={19} /></span>
        <span>JAJANIN </span>
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {menu.map((item) => {
          const active = item.href === activeHref;
          const Icon = iconByHref[item.href as keyof typeof iconByHref] ?? LayoutDashboard;

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={active ? "sidebar-link active" : "sidebar-link"}
              href={item.href}
              key={item.href}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="sidebar-logout">
        <button className="button danger" type="submit">
          <LogOut size={16} />
          Logout
        </button>
      </form>
    </aside>
  );
}
