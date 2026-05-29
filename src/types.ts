export type Role = "user" | "admin" | "kurir" | "owner";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  accountType: "pelanggan" | "staff";
};

export type SessionPayload = {
  user: AppUser;
  expiresAt: number;
};

export type SidebarItem = {
  label: string;
  href: string;
};
