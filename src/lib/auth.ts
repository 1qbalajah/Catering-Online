import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import { createSession, getSession } from "@/lib/session";
import { isRole, roleHome } from "@/lib/roles";
import type { AppUser, Role } from "@/types";

type DbUser = {
  id: number | string;
  name: string;
  email: string;
  password: string;
  level: string;
};

type DbPelanggan = {
  id: number | string;
  nama_pelanggan: string;
  email: string;
  password: string;
};

export type AuthAccount =
  | {
      accountType: "staff";
      data: DbUser;
    }
  | {
      accountType: "pelanggan";
      data: DbPelanggan;
    };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function findUserByEmail(email: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password,level")
    .eq("email", email)
    .maybeSingle<DbUser>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !isRole(data.level)) {
    return null;
  }

  return data;
}

export async function findPelangganByEmail(email: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pelanggans")
    .select("id,nama_pelanggan,email,password")
    .eq("email", email)
    .maybeSingle<DbPelanggan>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findAuthAccountByEmail(email: string): Promise<AuthAccount | null> {
  const staff = await findUserByEmail(email);

  if (staff) {
    return {
      accountType: "staff",
      data: staff,
    };
  }

  const pelanggan = await findPelangganByEmail(email);

  if (pelanggan) {
    return {
      accountType: "pelanggan",
      data: pelanggan,
    };
  }

  return null;
}

export function toAppUser(user: DbUser): AppUser {
  if (!isRole(user.level)) {
    throw new Error("Invalid user role.");
  }

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.level,
    accountType: "staff",
  };
}

export function toPelangganUser(pelanggan: DbPelanggan): AppUser {
  return {
    id: String(pelanggan.id),
    name: pelanggan.nama_pelanggan,
    email: pelanggan.email,
    role: "user",
    accountType: "pelanggan",
  };
}

export async function signInAccount(account: AuthAccount) {
  const appUser =
    account.accountType === "staff" ? toAppUser(account.data) : toPelangganUser(account.data);

  await createSession({ user: appUser });

  return appUser;
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

export function redirectToRoleHome(role: Role) {
  redirect(roleHome[role]);
}
