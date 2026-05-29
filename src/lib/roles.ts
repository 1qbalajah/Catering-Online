import type { Role } from "@/types";

export const roles = ["user", "admin", "kurir", "owner"] as const satisfies Role[];

export const roleHome: Record<Role, string> = {
  user: "/",
  admin: "/dashboard/admin",
  kurir: "/dashboard/kurir",
  owner: "/dashboard/owner",
};

export const routeRoles: Record<string, Role[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/kurir": ["kurir"],
  "/dashboard/owner": ["owner"],
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roles.includes(value as Role);
}

export function allowedRolesForPath(pathname: string): Role[] | null {
  const match = Object.entries(routeRoles)
    .sort(([a], [b]) => b.length - a.length)
    .find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return match?.[1] ?? null;
}
