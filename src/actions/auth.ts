"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase";
import {
  findAuthAccountByEmail,
  findPelangganByEmail,
  findUserByEmail,
  hashPassword,
  redirectToRoleHome,
  signInAccount,
  verifyPassword,
} from "@/lib/auth";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerAction(_: unknown, formData: FormData) {
  const namaPelanggan = readString(formData, "nama_pelanggan");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const tglLahir = readString(formData, "tgl_lahir");
  const telepon = readString(formData, "telepon");
  const alamat1 = readString(formData, "alamat1");

  if (!namaPelanggan || !email || password.length < 8) {
    return { error: "Nama pelanggan, email, dan password minimal 8 karakter wajib diisi." };
  }

  const [existingStaff, existingPelanggan] = await Promise.all([
    findUserByEmail(email),
    findPelangganByEmail(email),
  ]);

  if (existingStaff || existingPelanggan) {
    return { error: "Email sudah terdaftar." };
  }

  const supabase = createServiceClient();
  const passwordHash = await hashPassword(password);

  const { error } = await supabase.from("pelanggans").insert({
    nama_pelanggan: namaPelanggan,
    email,
    password: passwordHash,
    tgl_lahir: tglLahir || null,
    telepon: telepon || null,
    alamat1: alamat1 || null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function loginAction(_: unknown, formData: FormData) {
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const next = readString(formData, "next");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const account = await findAuthAccountByEmail(email);

  if (!account) {
    return { error: "Email atau password salah." };
  }

  const passwordValid = await verifyPassword(password, account.data.password);

  if (!passwordValid) {
    return { error: "Email atau password salah." };
  }

  const appUser = await signInAccount(account);

  if (appUser.role === "user" && next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }

  redirectToRoleHome(appUser.role);
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
