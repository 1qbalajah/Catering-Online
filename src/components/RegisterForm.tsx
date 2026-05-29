"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";

const initialState = {
  error: "",
};

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      <label className="field">
        <span>Nama Pelanggan</span>
        <input className="input" name="nama_pelanggan" placeholder="Nama lengkap" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" placeholder="user@email.com" type="email" required />
      </label>
      <label className="field">
        <span>Tanggal Lahir</span>
        <input className="input" name="tgl_lahir" type="date" />
      </label>
      <label className="field">
        <span>Telepon</span>
        <input className="input" name="telepon" placeholder="08123456789" />
      </label>
      <label className="field">
        <span>Alamat Utama</span>
        <input className="input" name="alamat1" placeholder="Alamat pelanggan" />
      </label>
      <label className="field">
        <span>Password</span>
        <input className="input" name="password" placeholder="Minimal 8 karakter" type="password" required />
      </label>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Membuat akun..." : "Register"}
      </button>
      <p className="muted" style={{ margin: 0 }}>
        Sudah punya akun? <Link href="/login">Login</Link>
      </p>
    </form>
  );
}
