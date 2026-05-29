import type { Role, SidebarItem } from "@/types";

export const sidebarMenus: Record<Role, SidebarItem[]> = {
  user: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Edit Profile", href: "/dashboard/profile/edit" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Pesanan", href: "/dashboard/admin/orders" },
    { label: "Product/Kelola Paket", href: "/dashboard/admin/data/paket" },
    { label: "Laporan", href: "/dashboard/admin/reports" },
  ],
  kurir: [
    { label: "Beranda", href: "/dashboard/kurir" },
    { label: "History Pengantaran", href: "/dashboard/kurir/riwayat" },
  ],
  owner: [
    { label: "Dashboard Owner", href: "/dashboard/owner" },
    { label: "Analytics", href: "/dashboard/owner/analytics" },
    { label: "Reports", href: "/dashboard/owner/reports" },
  ],
};

export function getSidebarByRole(role: Role) {
  return sidebarMenus[role];
}
